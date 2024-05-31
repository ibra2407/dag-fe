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


    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field:'gender', headerName:'Gender', width: 150}
    ];

    const s3Columns = [
        { field: 'Key', headerName: 'Key', width: 250 },
        { field: 'LastModified', headerName: 'Last Modified', width: 200 },
        { field: 'Size', headerName: 'Size', width: 100 },
        {
            field: 'url',
            headerName: 'URL',
            width: 300,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer">View</a>
            )
        }
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

    // Fetch S3 objects data from API
    useEffect(() => {
        const fetchS3Objects = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/list");
                const s3Data = response.data;
                console.log(s3Data.data);
                setS3Objects(s3Data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchS3Objects();
    }, []);

    // displays users on the webpage; maps & prints out the whole database (initial list; now in a component)
    // function listUsers() {
    //     return users.map((user) => {
    //         return (
    //             <div key={user.id} >
    //                 <h3>ID: {user.id}</h3>
    //                 <h3>Name: {user.name}</h3>
    //                 <h3>Gender: {user.gender}</h3>
    //             </div>)
    //     });
    // }   

    return (
        <>
            {/* returns both the database view + adding app component */}
            <Box sx={{ height: 400, width: '100%', backgroundColor:'#ffffff', borderRadius: 1 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    //checkboxSelection
                />
            </Box>
             
            {/* displays the user form underneath */}
            <br/>
            <AddApp setFormSubmitted={setFormSubmitted}/>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}> Images and Videos here:
                {s3Objects.map((obj, index) => (
                    <div key={index} style={{ margin: '10px' }}>
                        {obj.url.endsWith('.mp4') ? (
                            <video width="320" height="240" controls>
                                <source src={obj.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img src={obj.url} alt={obj.Key} style={{ maxWidth: '320px', maxHeight: '240px' }} />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
