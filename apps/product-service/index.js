const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const app = express();
app.use(express.json());

console.log("hi")
// Connects to Elasticsearch Pod inside K8s cluster
const esClient = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200' });

// Seed data fallback if Elasticsearch is indexing asynchronously via Kafka
const localFallbackCatalog = [
  { id: "p1", name: "Gaming Laptop RTX 4060", price: 1199 },
  { id: "p2", name: "Wireless Noise-Canceling Headphones", price: 299 },
  { id: "p3", name: "Mechanical Keyboard RGB", price: 89 }
];

app.get('/api/products', async (req, res) => {
  try {
    const searchResult = await esClient.search({
      index: 'products',
      query: { match_all: {} }
    });
    
    const items = searchResult.hits.hits.map(hit => hit._source);
    res.json(items.length > 0 ? items : localFallbackCatalog);
  } catch (err) {
    // Falls back gracefully if Elasticsearch is still bootstrap initializing
    res.json(localFallbackCatalog);
  }
});

app.listen(5001, () => console.log('Product Catalog Service active on port 5001'));