import React from 'react';

function bnToDate(bn) {
    let ms = bn.toString() * 1000
    let date = new Date(ms)
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
}


// Image Container Functional Component
function ImageContainer(props) {
    const images = props.images;
    const account = props.account;
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
                <td style={{verticalAlign: 'middle'}}>{image.description}</td>
                <td style={{verticalAlign: 'middle'}}>{window.web3.utils.fromWei(image.paidAmount.toString(), 'Ether')} ETH</td>
                <td style={{verticalAlign: 'middle'}}>{bnToDate(image.uploadTime)}</td>
                <td style={{verticalAlign: 'middle'}}>
                    <button name={image.id} onClick={(event) => {props.payNode(event.target.name)}} class="btn btn-primary btn-block btn-lg">Check</button>
                </td>
                </tr>
            )
        }
    });
    return (
      <table class="table" style={{marginTop: 15}}>
        <thead class="thead-dark">
          <th>Image</th>
          <th>Description</th>
          <th>Paid Amount</th>
          <th>Upload Time</th>
          <th>Check Proof of Work</th>
        </thead>
        {imageRow}
      </table>
    );
}

export default ImageContainer;
