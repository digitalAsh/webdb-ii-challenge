const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true,
  debug: true
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.get('/', (req, res) => {
  res.send('testing get');
})

//select * from zoos
server.get('/api/zoos', (req, res) => {
  db('zoos')
  .then(zoos =>{
    res.status(200).json(zoos);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

//select * from roles where id = :id
server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .first()
  .then(zoo => {
    if(zoo) {
    res.status(200).json(zoo);
    } else {
      res.status(404).json({ message: "Zoo not found" })
    }
  })
  .catch(err => {
    res.status(500).json(err);
  })
})

//insert
server.post('/api/zoos', (req, res) => {
  // insert into zoos () values ()
  db('zoos')
  .insert(req.body, 'id')
  .then(ids => {
    db('zoos')
      .where({ id: ids[0] })
      .first()
      .then(zoo =>{
        res.status(200).json(zoo);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

//update
server.put('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if(count > 0) {
        res.status(200).json({ message: `${count} records updated` })
      } else {
        res.status(404).json({ message: 'Role does not exist'})      }
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

//delete
server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .delete()
    .then(count => {
      if(count > 0) {
        res.status(200).json({ message: `${count} records deleted` })
      } else {
        res.status(404).json({ message: 'Role does not exist'})      }
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
