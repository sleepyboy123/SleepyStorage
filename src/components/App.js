import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import { create } from 'ipfs-http-client'
import Image from '../abis/Image.json'

// const client = create('https://ipfs.infura.io:5001/api/v0')
const client = create('/ip4/127.0.0.1/tcp/5001')

// const payableAddress = "0xD314035cB64cbb62e9841B0C922CDC8Dc356D8b6";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      imageHash: '',
      account: '',
      contract: null,
    }
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()
    const gasPrice = await web3.eth.getGasPrice()
    console.log(gasPrice)

    const networkData = Image.networks[networkId]
    this.setState({ 
      account: accounts[0],
    })
    if (networkData) {
      // Fetch Contract
      // abi describes how the smart contract works
      const abi = Image.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({contract})
      const imageHash = await contract.methods.get().call()
      this.setState({imageHash})
    } else {
      window.alert('Smart Contract not deployed to detected network')
    }
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

  onSubmit = async (event) => {
    event.preventDefault();
    if (this.state.buffer) {
      try {
        const added = await client.add(this.state.buffer)
        const imageHash = added.path 
        this.state.contract.methods.set(imageHash).send({ from: this.state.account }).then((r) => {
          this.setState({imageHash})
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  checkProof = async (event) => {
    event.preventDefault();
    if (this.imageHash) {
      try {
        console.log('Check Proof')
      } catch (error) {
        console.error(error)
      }
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
                <img style={{height: 200, width: 200}} 
                  onError={(e) => {e.target.onerror = null; e.target.src="https://hotemoji.com/images/dl/j/sleepy-emoji-by-twitter.png"}} 
                  src={'http://127.0.0.1:8080/ipfs/' + this.state.imageHash} className="App-logo" alt="logo" 
                />
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
