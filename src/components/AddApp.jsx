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
    });

    const setFormSubmitted = props.setFormSubmitted;

    const handleSubmit = async (e) => {   
        e.preventDefault();
        try {
            if (!form.id || !form.name || !form.gender) {
                alert("Please fill out all fields");
                return;
            }
            console.log(form);
            const response = await axios.post("http://localhost:8000/api/users", form);
            console.log(response);
            setFormSubmitted(true);
        }
        catch (err) {
            console.log(err);
        }
        
    }


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
                    
                </form>

                <button type="submit" className="btn btn-primary">Submit</button>
                
            </div>
                
        </>
    );
}