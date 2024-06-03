import { useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
// import FormControl from 'react-bootstrap/FormControl';

 
export function AddApp(props) {

    // This component creates a user form to fill in their details

    const [form, setForm] = useState({
        id:"",
        name:"",
        gender:"",
        imageURL:""
    });
    const [image, setImage] = useState(null);
    const setFormSubmitted = props.setFormSubmitted;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.id || !form.name || !form.gender) {
            alert("Please fill out all fields");
            return;
        }

        if (!image) {
            alert("Please select an image to upload");
            return;
        }

        // Image upload process
        const formData = new FormData();
        formData.append('image', image);

        try {
            const uploadResponse = await axios.post("http://localhost:8000/api/s3/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (uploadResponse.data.success) {
                const imageUrl = uploadResponse.data.url;
                const formDataWithImage = { ...form, imageURL: imageUrl };

                // Submit the form with the image URL
                const response = await axios.post("http://localhost:8000/api/users", formDataWithImage);
                console.log(response);
                setFormSubmitted(true);
            } else {
                alert("Image upload failed");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            if (!form.id) {
                alert("Please provide the ID of the user to delete");
                return;
            }
            console.log(form);
            const response = await axios.delete(`http://localhost:8000/api/users/${form.id}`);
            console.log(response);
            setFormSubmitted(true);
        } catch (err) {
            console.log(err);
        }
    }

    // const handleImageUpload = async (e) => {
    //     e.preventDefault();
    //     if (!image) {
    //         alert("Please select an image to upload");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('image', image);

    //     try {
    //         const response = await axios.post("http://localhost:8000/api/upload", formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         console.log(response.data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }


    return (
        <>  
        {/* note: the ...form means "opening up" the Form object data */}
            <div>
                <a>Add User</a>
            </div>

            <div className="body">
                <form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>ID:</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            placeholder="id"
                            value={form.id}
                            onChange={(e) => setForm({...form, id: e.target.value})}>
                        </Form.Control>

                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="name"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}>
                        </Form.Control>
                        
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Gender:</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="gender"
                            value={form.gender}
                            onChange={(e) => setForm({...form, gender: e.target.value})}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Image:</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}>
                        </Form.Control>
                    </Form.Group>

                {/* submit button needs to be inside form div */}
                  <button type="submit" className="btn btn-primary">Submit</button>
                    
                </form>
                
                <a>Delete User by ID</a>
            
                <form onSubmit={handleDelete} style={{ marginTop: "20px" }}>
                    <button type="submit" className="btn btn-danger">Delete</button>
                </form>

                {/* <a>Upload Image</a>

                <form onSubmit={handleImageUpload} style={{ marginTop: "20px" }}>
                    <Form.Group>
                        <Form.Label>Image:</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}>
                        </Form.Control>
                    </Form.Group>
                    <button type="submit" className="btn btn-primary">Upload</button>
                </form> */}

            </div>
                
        </>
    );
}
