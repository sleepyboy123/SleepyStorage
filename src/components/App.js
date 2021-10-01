import React, { Component } from 'react';
import './App.css';
import { create } from 'ipfs-http-client'

const client = create('https://ipfs.infura.io:5001/api/v0')

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      imageHash: 'QmenyRPcPjghG1RJ3PVSFVkyhEMaDxnHr8LFsbhV7httKN'
    }
  }

  // Example Path: QmenyRPcPjghG1RJ3PVSFVkyhEMaDxnHr8LFsbhV7httKN
  getFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result)
      })
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    try {
      const added = await client.add(this.state.buffer)
      this.setState({
        imageHash: added.path
      })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://sleepytyper.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sleepy Storage
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                <img style={{height: 200, width: 200}} src={'https://ipfs.infura.io/ipfs/' + this.state.imageHash} className="App-logo" alt="logo" />
                <h2 style={{paddingTop: 15, paddingBottom: 15}}>Upload File</h2>
                <form onSubmit={this.onSubmit}>
                  <input type="file" onChange={this.getFile}/>
                  <input type="submit"/>
                </form> 
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
