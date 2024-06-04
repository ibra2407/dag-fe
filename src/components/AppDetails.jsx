import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";
// import Form from "react-bootstrap/Form"
import { AddApp } from "./AddApp";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

export function AppDetails() {

    // This component takes in data from the database connected and displays the entries as a list

    // empty useState; will pass in data below
    const [users, setUsers] = useState([]);

    const [formSubmitted, setFormSubmitted] = useState(false);

    const [s3Objects, setS3Objects] = useState([]);

    const [key, setKey] = useState('');


    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field:'gender', headerName:'Gender', width: 150}
    ];

    // passes in data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // this is routes.js READ ALL USERS
                const response = await axios.get("http://localhost:8000/api/users");
                const userData = response.data;
                console.log(userData.data);
                setUsers(userData.data);
                setFormSubmitted(false);
            }
            catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [formSubmitted]);

    // Fetch S3 object data from API using the key
    const fetchS3Object = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/get/${key}`);
            const s3Data = response.data;
            console.log(s3Data);
            setS3Objects(s3Data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleInputChange = (e) => {
        setKey(e.target.value);
    };

    const handleFetchClick = () => {
        fetchS3Object();
    };

    return (
        <>
            {/* returns both the database view + adding app component */}
            <Box sx={{ height: 400, width: '100%', backgroundColor:'#ffffff', borderRadius: 1 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Box>
             
            {/* displays the user form underneath */}
            <br/>
            <AddApp setFormSubmitted={setFormSubmitted}/>
    
            {/* Form to enter the S3 object key */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter S3 Object Key"
                    value={key}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
                <button
                    onClick={handleFetchClick}
                    style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}
                >
                    Fetch S3 Object
                </button>
            </div>
    
            {/* Display S3 objects JSON */}
            {s3Objects && (
                <div style={{ width: '100%', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '4px', marginTop: '20px' }}>
                    <pre>{JSON.stringify(s3Objects, null, 2)}</pre>
                </div>
            )}
        </>
    );
    
}