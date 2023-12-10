import './App.css';
import './pages/create';
import React, {Component, useContext, useRef, useState} from "react";
import {Navbar, Nav, Container, Button} from 'react-bootstrap'
import {Create, Home, List, Login, Results, PostDetails, ForumDetails} from './pages'
import {Link, Route, Routes, useParams, useLocation, useNavigate} from "react-router-dom";
import linkStyle from './index.css'

//creating app
class App extends Component {

  constructor(props) {
    super(props); //we are calling constructor for the component
    this.state = { //makes the toDoItems variable is accessible in App
      showAddItemInput: false,
      newItemText: "",

      searchText: "",
    }
  };

  handleSearchInput = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  };

  renderItems = () => { //declaring function

    let listItems = []
    const todoList = this.state.todoList

    for (let i = 0; i < todoList.length; i++) {
      let item = todoList[i]
      let todoTitle = item.title

      //check if task is done
      if(item.completed){
        todoTitle += ' (done)'
      }

      listItems.push(
          <li className="list-group-item align-items-center d-flex justify-content-between">
            <span>{todoTitle}</span>
            <button className={"btn btn-danger"} onClick={() => this.deleteItem(item.id)}>Delete</button>
          </li>
      )
    }

    return listItems
  }

  state = {
    searchText: ""
  }

  routeSearch = () =>{
    if (this.state.searchText){
      this.props.history.push(
          {pathname:"/results",
            state: {
              searchText: this.state.searchText
            }});
    } else {
      alert("Put something to search!")
    }
  }

  render (){
    const setSearchText = ""
    return (
        //container
        <main className='Container'>
          <>
            {/*<div className={"divStyle_user bg-body-tertiary"}>*/}
            {/*  <Link className={"linkStyle fs-7"} to={"/login"}>User</Link>*/}
            {/*</div>*/}
            {/*no more user it's time to give up on that*/}
            <Navbar expand="lg" className="bg-body-tertiary">
              <Container>
                {/*nav bar home logo*/}
                <Navbar.Brand href="/" className={"me-4 ms-4 d-inline-flex"}>
                  <img src={"/mush_logo.png"}
                       width={"80"}
                       height={"80"}
                       alt={"Mushroom Hunt"}/>

                  <div className={"mt-3"}>
                    <h1>Mushroom Hunt</h1>
                  </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    {/*links to other pages*/}
                    <Link className={"linkStyle"} to={"/list"}>List</Link>
                    <Link className={"linkStyle"} to={"/create"}>Create</Link>
                    <Link className={"linkStyle"} to={"/setting"}>Setting</Link>
                  </Nav>
                </Navbar.Collapse>

                {/*search bar and button*/}
                <div className={"col-md-3 d-inline-flex"}>
                  {/*search bar*/}
                  <input type={"text"}
                         className={"form-control align-items-end d-flex justify-content-between"}
                         value={this.state.searchText}
                         onChange={this.handleSearchInput}
                         ref={"inputRef"}
                         placeholder={"Search..."}/>

                  {/*search button*/}
                  <Button className={"btn btn-success"} as={Link} to={`/results?q=${encodeURIComponent(this.state.searchText)}`}>
                  Search</Button>
                </div>

              </Container>

            </Navbar>
            <Routes>
              <Route index element={<Home/>}></Route>
              <Route path={'login'} element={<Login/>}></Route>
              <Route path={'list'} element={<List/>}></Route>
              <Route path={'create'} element={<Create/>}></Route>
              <Route path={'/results'} element={<Results/>}></Route>

              {/*detail page of post*/}
              <Route path={'/post/:id'} element={<PostDetails/>} />

              {/*detail page of forum*/}
              <Route path={'/forum/:id'} element={<ForumDetails/>} />


            </Routes>
          </>
        </main>
    );
  }

}

export default App;
