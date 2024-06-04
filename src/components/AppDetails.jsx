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

    const [s3Object, setS3Object] = useState([]);

    const [s3Objects, setS3Objects] = useState([]);

    const [key, setKey] = useState('');

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'AppIcon', headerName: 'AppIcon', width: 150 }
    ];

    // passes in data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // this is routes.js READ ALL USERS
                const response = await axios.get("http://localhost:8000/db/users");
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
            const response = await axios.get(`http://localhost:8000/s3/get/${key}`);
            const s3Data = response.data;
            console.log(s3Data);
            setS3Object(s3Data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchS3Objects = async () => {
        try {
            const response = await axios.get("http://localhost:8000/s3/list");
            const s3Data = response.data;
            setS3Objects(s3Data.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch S3 objects data from API
    useEffect(() => {
        fetchS3Objects();
    }, []);

    const handleInputChange = (e) => {
        setKey(e.target.value);
    };

    const handleFetchClick = () => {
        fetchS3Object();
        fetchS3Objects();
    };

    const deleteImage = async (key) => {
        try {
            await axios.delete(`http://localhost:8000/s3/delete/${key}`);
            fetchS3Objects();
        } catch (error) {
            console.error("Error deleting image:", error);
        }
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

                <button onClick={handleFetchClick}> Fetch S3 Object by Tag </button>

                <button onClick={() => deleteImage(key)}> Delete Image by Tag </button>

            </div>
    
            {/* Display S3 objects JSON */}
            {s3Object && (
                <div style={{ width: '100%', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '4px', marginTop: '20px' }}>
                    <pre>{JSON.stringify(s3Object, null, 2)}</pre>
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                Images and Videos here:
                { Array.isArray(s3Objects) && s3Objects.length > 0 ? (
                    s3Objects.map((obj, index) => (
                        <div key={index} style={{ margin: '10px' }}>
                            {obj.Key.endsWith('.mp4') ? (
                                <div>
                                    <video width="900" height="600" autoPlay muted loop>
                                        <source src={obj.url} alt={obj.Key} type="video/mp4" />
                                    </video>
                                    <button onClick={() => deleteImage(obj.Key)}>Delete</button>
                                </div>
                            ) : (
                                <div>
                                    <img src={obj.url} alt={obj.Key} style={{ maxWidth: '900px', maxHeight: '600px' }} />
                                    <button onClick={() => deleteImage(obj.Key)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No images or videos available.</p>
                )}
            </div>
        </>
    );
    
}