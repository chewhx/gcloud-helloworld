import React, { useState } from "react";
import { Container, Button, Form, Row, ListGroup } from "react-bootstrap";
import axios from "axios";

const App = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState("");

  const submitHandler = async (v) => {
    try {
      const { data } = await axios({
        method: "post",
        url: `http://localhost:5000/api/v1/search`,
        data: {
          search: v,
        },
      });
      setResults(data.response.docs);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Container>
      <Row>
        <Form.Group>
          <Form.Label htmlFor="searchbar">
            <h1>Search NYT</h1>
          </Form.Label>
          <Form.Control
            className="my-3"
            type="text"
            name="searchbar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" onClick={() => submitHandler(search)}>
            Search
          </Button>
        </Form.Group>
      </Row>
      <Row>
        {!results
          ? ""
          : results.map(({ abstract, web_url, lead_paragraph, source }) => (
              <ListGroup>
                <ListGroup.Item>
                  <a href={web_url} target="_blank">
                    {abstract}
                  </a>
                  <br />
                  <small>{lead_paragraph}</small>
                  <p>{source}</p>
                </ListGroup.Item>
              </ListGroup>
            ))}
      </Row>
    </Container>
  );
};

export default App;
