import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    fetchProduct();
  });

  const fetchProduct = async () => {
    await axios
      .get(`http://http://127.0.0.1:8000/api/products/${id}`)
      .then(({ data }) => {
        const { title, description } = data.product;
        setTitle(title);
        setDescription(description);
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };

  const changeHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image !== null) {
      formData.append("image", image);
    }

    await axios
      .post(`http://http://127.0.0.1:8000/api/products/${id}`, formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "Success",
          text: data.message,
        });
        navigate("/");
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors);
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Update Product</h4>
            <hr />
            <div className="form-wrapper">
              {Object.keys(validationError).length > 0 && (
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-danger">
                      <ul className="mb-0">
                        {Object.entries(validationError).map(([key, value]) => (
                          <li key={key}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              <Form onSubmit={updateProduct}>
                <Row>
                  <Col>
                    <Form.Group controlId="Name">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={title}
                        onChange={(event) => {
                          setTitle(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col>
                    <Form.Group controlId="Description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="textarea"
                        value={description}
                        onChange={(event) => {
                          setDescription(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col>
                    <Form.Group controlId="Image">
                      <Form.Label>Image</Form.Label>
                      <Form.Control
                        type="file"
                        value={description}
                        onChange={changeHandler}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  className="mt-2"
                  size="lg"
                  block="block"
                  type="submit"
                >
                  Update
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
