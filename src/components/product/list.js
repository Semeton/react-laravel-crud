import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    await axios
      .get(`http://http://127.0.0.1:8000/api/products`)
      .then(({ data }) => {
        setProducts(data);
      });
  };

  const deleteProduct = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "You wont be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Yes, delete it!",
    }).then((result) => {
      return result.isConfirmed;
    });
    if (!isConfirm) {
      return;
    }
    await axios
      .delete(`http://http://127.0.0.1:8000/api/products/${id}`)
      .then(({ data }) => {
        Swal.fire({
          icon: "Success",
          text: data.message,
        });
        fetchProducts();
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Link
            className="btn btn-primary mb-2 float-end"
            to={`/product/create`}
          >
            Create Product
          </Link>
        </div>
        <div className="col-12">
          <div className="card card-body">
            <div className="table-responsive">
              <table className="table table-bordered mb-0 text-center">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 &&
                    products.map((row, key) => (
                      <tr key={key}>
                        <td>{row.title}</td>
                        <td>{row.description}</td>
                        <td>
                          <img
                            width="50px"
                            src={`http://http://127.0.0.1:8000/storage/product/image/${row.image}`}
                            alt="desc"
                          />
                        </td>
                        <td>
                          <Link
                            to={`/product/edit/${row.id}`}
                            className="btn btn-success me-2"
                          >
                            Edit
                          </Link>
                          <Button
                            variant="danger"
                            onClick={() => deleteProduct(row.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
