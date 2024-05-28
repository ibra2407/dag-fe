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

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field:'gender', headerName:'Gender', width: 150}
    ];

    // passes in data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://3.0.49.86:8000/api/users");
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

    // displays users on the webpage; maps & prints out the whole database
    function listUsers() {
        return users.map((user) => {
            return (
                <div key={user.id} >
                    <h3>ID: {user.id}</h3>
                    <h3>Name: {user.name}</h3>
                    <h3>Gender: {user.gender}</h3>
                </div>)
        });
    }   

    return (
        <>
            {/* returns both the database view + adding app component */}
            <Box sx={{ height: 400, width: '100%', backgroundColor:'#ffffff' }}>
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
        </>
    );
}
