const { assert, expect } = require('chai');
const ImageContract = artifacts.require("ImageContract");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ImageContract', ([deployer, owner, tipper]) => {
    let image

    // Code that is run before all the tests
    before(async () => {
        image = await ImageContract.deployed()
    })

    // Write Tests Here
    describe('deployment', async () => {
        it('Successfull Deployment', async () => {
            const address = image.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    })

    describe('images', async () => {
        let result, imageCount
        const imageHash = 'QmenyRPcPjghG1RJ3PVSFVkyhEMaDxnHr8LFsbhV7httKN'

        before(async () => {
            result = await image.uploadImage(imageHash, {from: owner});
            imageCount = await image.imageCount()
        })

        it('Image Created', async () => {
            // SUCCESS
            assert.equal(imageCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'ID is Correct')
            assert.equal(event.imageHash, imageHash, 'Image Hash is Correct')
            assert.equal(event.paidAmount, '0', 'Paid Amount is Correct')
            assert.equal(event.owner, owner, 'Owner is Correct')
            console.log(event.uploadTime)

            // FAILURE Image must have hash
            await image.uploadImage('imageHash', '', {from: owner}).should.be.rejected;
        })
        
        it('List Images', async () => {
            const imageStructure = await image.images(imageCount)
            assert.equal(imageStructure.id.toNumber(), imageCount.toNumber(), 'ID is Correct')
            assert.equal(imageStructure.imageHash, imageHash, 'Image Hash is Correct')
            assert.equal(imageStructure.paidAmount, '0', 'Paid Amount is Correct')
            assert.equal(imageStructure.owner, owner, 'Owner is Correct')
        })

        it('Testing Pay Feature', async () => {
            // Track the owner balance before purchase
            let oldOwnerBalance
            oldOwnerBalance = await web3.eth.getBalance(owner)
            oldOwnerBalance = new web3.utils.BN(oldOwnerBalance)

            // Wei is like Ethereums Pennies 1 Ether = 1,000,000,000,000,000,000 Wei
            result = await image.payNode(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

            // SUCCESS
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'ID is Correct')
            assert.equal(event.imageHash, imageHash, 'Image Hash is Correct')
            assert.equal(event.paidAmount, '1000000000000000000', 'Paid Amount is Correct')

            // Check that owner received funds
            let newOwnerBalance
            newOwnerBalance = await web3.eth.getBalance(owner)
            newOwnerBalance = new web3.utils.BN(newOwnerBalance)

            assert.notEqual(newOwnerBalance, oldOwnerBalance, 'Money has been Deducted')

            // FAILURE Paying for Image that does not exist
            await image.payNode(99, { from: owner, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
        })
    })
})