import React, { useState } from 'react';

function bnToDate(bn) {
    let ms = bn.toString() * 1000
    let date = new Date(ms)
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
}


// Image Container Functional Component
function ImageContainer(props) {
    const [challenge, setChallenge] = useState('');
    const [b64Image, setB64Image] = useState(null)
    const images = props.images;
    const account = props.account;

    function handleChange(e) {
        setChallenge(e.target.value)
    }

    function getFile(event) {
        event.preventDefault();
        const file = event.target.files[0];
        // Handles situation where file is not uploaded
        if (file !== undefined) {
            const reader = new window.FileReader();
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                setB64Image(reader.result)
            }
        }
    }

    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))
  
    function checkProof(event, imageHash) {
        if (b64Image && challenge) {
            toDataURL('http://127.0.0.1:8080/ipfs/' + imageHash).then(b64IPFSImage => {
                if (b64Image == b64IPFSImage) {
                    alert(b64Image.substring(0, 250))
                    alert('it is the same...')
                } else {
                    alert('it is different...')
                }

            })        
        } else {
            // alert('Please Upload Challenge Image & Text')
        }
    }
 
    const imageRow = images.map(function (image, key) {
        if (image.owner !== account) {
            return
        } else {
            return (
                <tr key={key}>
                <td>
                    <img style={{height: 200, width: 200}} 
                    onError={(e) => {e.target.onerror = null; e.target.src="https://hotemoji.com/images/dl/j/sleepy-emoji-by-twitter.png"}} 
                    src={'http://127.0.0.1:8080/ipfs/' + image.imageHash} className="App-logo" alt="logo" 
                    /> 
                </td>
                <td style={{verticalAlign: 'middle'}}>{window.web3.utils.fromWei(image.paidAmount.toString(), 'Ether')} ETH</td>
                <td style={{verticalAlign: 'middle'}}>{bnToDate(image.uploadTime)}</td>
                <td style={{verticalAlign: 'middle'}}>
                    <input type="file" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={getFile}/>
                </td>
                <td style={{verticalAlign: 'middle'}}>
                    <input
                        id="Challenge Text"
                        type="text"
                        value={challenge} 
                        className="form-control"
                        placeholder="Challenge"
                        onChange={handleChange}
                        required
                    />
                </td>
                <td style={{verticalAlign: 'middle'}}>
                    {/* <button name={image.id} onClick={(event) => {props.payNode(event.target.name)}} class="btn btn-primary btn-block btn-lg">Check</button> */}
                    <button name={image.id} onClick={e => checkProof(e, image.imageHash)} class="btn btn-primary btn-block btn-lg">Check</button>
                </td>
                </tr>
            )
        }
    });
    return (
      <table class="table" style={{marginTop: 15}}>
        <thead class="thead-dark">
          <th>Image</th>
          <th>Paid Amount</th>
          <th>Upload Time</th>
          <th>Challenge File</th>
          <th>Challenge Text</th>
          <th>Check Proof of Work</th>
        </thead>
        {imageRow}
      </table>
    );
}

export default ImageContainer;
