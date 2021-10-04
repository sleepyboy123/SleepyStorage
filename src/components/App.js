import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import { create } from 'ipfs-http-client'
import Image from '../abis/ImageContract.json'
import Loader from "react-loader-spinner";

// const client = create('https://ipfs.infura.io:5001/api/v0')
const client = create('/ip4/127.0.0.1/tcp/5001')

// const payableAddress = "0xD314035cB64cbb62e9841B0C922CDC8Dc356D8b6";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      description: null,
      images: [],
      account: '',
      contract: null,
      loading: false,
    }
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Please use metamask')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()

    const networkData = Image.networks[networkId]
    this.setState({ 
      account: accounts[0],
    })

    if (networkData) {
      // Fetch Contract
      // abi describes how the smart contract works
      this.setState({loading: true})
      const abi = Image.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({contract})
      const imageCount = await contract.methods.imageCount().call()
      for (var i = 1; i <= imageCount; i++) {
        const image = await contract.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
    } else {
      window.alert('Smart Contract not deployed to detected network')
    }
    this.setState({loading: false})
  }

  // Example Path: QmenyRPcPjghG1RJ3PVSFVkyhEMaDxnHr8LFsbhV7httKN
  getFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    // Handles situation where file is not uploaded
    if (file !== undefined) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        this.setState({
          buffer: Buffer(reader.result)
        })
      }
    }
  }

  handleChange=(e)=>{
    this.setState({description: e.target.value})
  }
  
  onSubmit = async (event) => {
    event.preventDefault();
    if (this.state.buffer) {
      try {
        this.setState({loading: true})
        const added = await client.add(this.state.buffer)
        const imageHash = added.path
        this.state.contract.methods.uploadImage(imageHash, this.state.description).send({ from: this.state.account }).then((r) => {
          this.setState({imageHash})
        })
      } catch (error) {
        console.error(error)
      }
      this.setState({loading: false})
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
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h2 style={{paddingTop: 15}}>Upload File</h2>
                <form onSubmit={this.onSubmit}>
                  <input type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.getFile}/>
                  <input
                    style={{marginTop: 15}}
                    id="imageDescription"
                    type="text"
                    value={this.state.value} 
                    onChange={this.handleChange}
                    className="form-control"
                    placeholder="Image description..."
                  required />
                  <button style={{marginTop: 15}} type="submit" class="btn btn-primary btn-block btn-lg">Upload</button>
                </form> 
              </div>
            </main>
          </div>
            { this.state.loading ?
              <div className="row" style={{justifyContent: "center", marginTop: 30}}>
                  <main role="main">
                    <Loader type="Circles" color="#00BFFF" height={300} width={300} />
                  </main>
              </div>
              :
              <div className="row">
                  <main role="main" className="col-lg-12 d-flex text-center">
                    <ImageContainer images={this.state.images} />
                  </main>
              </div>
            }
        </div>
      </div>
    );
  }
}

export default App;

function bnToDate(bn) {
  let ms = bn.toString() * 1000
  let date = new Date(ms)
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
}

// Image Container Functional Component
function ImageContainer(props) {
  const images = props.images;
  const imageRow = images.map((image, key) => 
    <tr key={key}>
      <td>
        <img style={{height: 200, width: 200}} 
        onError={(e) => {e.target.onerror = null; e.target.src="https://hotemoji.com/images/dl/j/sleepy-emoji-by-twitter.png"}} 
        src={'http://127.0.0.1:8080/ipfs/' + image.imageHash} className="App-logo" alt="logo" 
        /> 
      </td>
      <td style={{verticalAlign: 'middle'}}>{image.description}</td>
      <td style={{verticalAlign: 'middle'}}>{window.web3.utils.fromWei(image.paidAmount.toString(), 'Ether')} ETH</td>
      <td style={{verticalAlign: 'middle'}}>{bnToDate(image.uploadTime)}</td>
      <td style={{verticalAlign: 'middle'}}>
        <button class="btn btn-primary btn-block btn-lg">WIP</button>
      </td>
    </tr>
  );
  return (
    <table class="table" style={{marginTop: 15}}>
      <thead class="thead-dark">
        <th>Image</th>
        <th>Description</th>
        <th>Paid Amount</th>
        <th>Upload Time</th>
        <th>Cool Button</th>
      </thead>
      {imageRow}
    </table>
  );
}
