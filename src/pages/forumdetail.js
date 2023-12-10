import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {reformatDate, reformatTime} from './home'
import Heart from "react-heart";

const ForumDetails = () => {
    const { id } = useParams();
    const [forum, setForum] = useState({});

    useEffect(() => {
        const fetchForumDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/forums/${id}/`);
                const forumData = await response.json();
                setForum(forumData); //update the state with the fetched data
            } catch (error) {
                console.error('Problem with the fetch for forum details', error);
            }
        };

        fetchForumDetails();
    }, [id]);

    //set favourite + make heart. toggle/edit from a2
    const toggleFavourite = () => {
        fetch(`http://127.0.0.1:8000/api/forums/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                favourite: !forum.favourite,
            }),
        })
            .then(response => {
                if (response.ok) {
                    // alert('Added to Favourites!');
                    setForum((prevForum) => ({
                        ...prevForum,
                        favourite: !prevForum.favourite,
                    }));
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('There has been a problem with your favourite operation:', error);
                alert('Error 404: Favourite could not be toggled');
            });
    }

    return (
        <div>
            <Link className={"links"} to="/">Go back</Link>
            <div className="card col-md-9 col-sm-10 mt-4 mx-auto">
                <div className={""}>
                    <div className={"detailimgDisplay m-1"}>
                    </div>
                    {/*text box display*/}
                    <div className={"detailtextbox"}>
                        <h2>{forum.title}</h2>
                        <p className={"smallinfotext"}>Posted by: {forum.user && forum.user.username}</p>
                        {/*no more crash on load*/}
                        <p className={"smallinfotext"}>{forum.datetime && `${reformatDate(forum.datetime)} ${reformatTime(forum.datetime)}`}</p>
                        <p>{forum.description}</p>
                        {/*favourite heart button*/}
                        <div style={{ width: "2rem" }}>
                            <Heart isActive={forum.favourite}
                                   onClick={toggleFavourite}
                                   animationScale = {1.25}
                                   style = {{marginBottom:'1rem'}} />
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
}

export default ForumDetails;
