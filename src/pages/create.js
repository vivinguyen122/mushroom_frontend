import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            username: "",

            selectedImage: null,

            showPostType: true, //bool to show which radio is selected
            postType: 'post' //set the post type for radio button check
        };
    }

    // Upload image function
    handleFileChange = (e) => {
        const mush_img = e.target.files[0];

        if (mush_img) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    selectedImage: mush_img,
                    imagePreview: reader.result,
                });
            };
            reader.readAsDataURL(mush_img);
        } else {
            this.setState({
                selectedImage: null,
                imagePreview: null,
            });
        }
    };

    switchPostView = () => { //switch the bool for the view
        this.setState({
            showForumType:false
        })
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    };

    handleDescriptionChange = (e) => {
        this.setState({ description: e.target.value });
    };

    handleUserChange = (e) => {
        this.setState({ username: e.target.value });
    };

    handleCreatePost = () => {
        const { title, description, username } = this.state;

        if (title && description && username) {
            const requestBody = {
                title: title,
                description: description,
                username: username,
            };

            // if an image is selected, add it to the body so that it is sent in post request
            if (this.state.selectedImage) {
                requestBody.img = this.state.selectedImage;
            }

            fetch("http://127.0.0.1:8000/api/posts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Post created successfully:", data);
                })
                .catch((error) => {
                    console.error("Error creating post:", error);
                });
        } else {
            // Check if all required fields are filled. if not, show this error
            alert("Fill in all fields before creating a post.");
        }
    };

    handleCreateForum = () => {
        const { title, description, username } = this.state;
        if (title && description && username) {
            fetch("http://127.0.0.1:8000/api/forums/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    username: username,
                }),

            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Post created successfully:", data);

                })
                .catch((error) => {
                    console.error("Problem with creating post:", error);
                });
        } else {
            alert("Please fill in all fields before creating a post.");
        }
    };

    render() {
        const { title, description, username } = this.state;

        const selectedImage = this.state.selectedImage
        const showPostType = this.state.showPostType
        const { imagePreview } = this.state;

        return (
            <div className="row">
                {/*limit box to certain size*/}
                <div className="col-md-9 col-sm-10 mt-4 mx-auto">
                    <div className="card p-3">
                        <div className={"mb-4"}>

                            <h1 className={"m-1 mb-4"}>Create</h1>

                            {/*radio buttons*/}
                            <form className={"m-1 mb-5"}>
                                {/*radio post button*/}
                                <label className={"me-5"}>
                                    <input type={"radio"}
                                           value={"post"}
                                           checked={this.state.postType === "post"}
                                        //make the radio button change when i click it
                                           onClick={() => this.setState({showPostType: true, postType: 'post'})}
                                           name={"create_type"}/>
                                    Post
                                </label>

                                {/*radio forum button*/}
                                <label>
                                    <input type={"radio"}
                                           value={"forum"}
                                           name={"create_type"}
                                           checked={this.state.postType === "forum"}
                                           onClick={() => this.setState({showPostType: false, postType: 'forum'})}
                                           className={"ms-3"}/>
                                    Forum
                                </label>
                            </form>

                            {/*make conditional display*/}
                            {showPostType ? ( //if true, show post template
                                <div className={"d-inline-flex"} style={{width: "100%"}}>
                                    {/*image display*/}
                                    <div className={"ms-3 me-3"} style={{width: "25%"}}>
                                        {imagePreview && (
                                            <div className="mb-3">
                                                <p>Image Preview:</p>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    style={{ maxHeight: "150px" }}
                                                />
                                            </div>
                                        )}
                                        {/*img upload*/}
                                        <Form.Group controlId="formFile" className="mb-3">
                                            <Form.Label>Upload Image</Form.Label>
                                            <Form.Control type="file" onChange={this.handleFileChange} />
                                        </Form.Group>
                                    </div>

                                    {/*Title input field*/}
                                    <div className={"ms-3 me-3"} style={{width: "70%"}}>
                                        <input type={"text"}
                                               className={"mb-2 form-control"}
                                               value={title}
                                               onChange={this.handleTitleChange}
                                               placeholder={"Enter title..."}>
                                        </input>

                                        {/*Username input field*/}
                                        <input type={"text"}
                                               className={"mb-2 form-control"}
                                               onChange={this.handleUserChange}
                                               value={username}
                                               placeholder={"Enter Username..."}>
                                        </input>


                                        {/*Description input field*/}
                                        <div style={{height: "200px"}}>
                                    <textarea className={"textStyle form-control"}
                                              onChange={this.handleDescriptionChange}
                                              value={description}
                                              placeholder={"Enter description..."}>
                                    </textarea>
                                        </div>

                                        {/*submit button*/}
                                        <Button onClick={this.handleCreatePost} className={"mt-2"}>Create</Button>
                                    </div>


                                </div>
                            ) : ( //if false, show the forum template
                                <>
                                    {/*Title input field*/}
                                    <div style={{width: "100%"}}>
                                        <input type={"text"}
                                               className={"mb-2 form-control"}
                                               onChange={this.handleTitleChange}
                                               value={title}
                                               placeholder={"Enter title..."}>
                                        </input>

                                        {/*Username input field*/}
                                        <input type={"text"}
                                               className={"mb-2 form-control"}
                                               onChange={this.handleUserChange}
                                               value={username}
                                               placeholder={"Enter Username..."}>
                                        </input>

                                        {/*Description input field*/}
                                        <div style={{height: "200px"}}>
                                    <textarea className={"textStyle form-control"}
                                              value={description}
                                              onChange={this.handleDescriptionChange}
                                              placeholder={"Enter description..."}>
                                    </textarea>
                                        </div>

                                        {/*submit button*/}
                                        <Button onClick={this.handleCreateForum} className={"mt-2"}>Create</Button>
                                    </div>
                                </>
                            )}

                            {/*<ul className="list-group">*/}
                            {/*    {this.renderItems()}*/}
                            {/*</ul>*/}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreatePost;