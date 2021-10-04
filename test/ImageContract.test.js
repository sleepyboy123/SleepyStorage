const { assert } = require('chai');
const ImageContract = artifacts.require("ImageContract");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ImageContract', ([deployer, author, tipper]) => {
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
            result = await image.uploadImage(imageHash, 'Test Description', {from: author});
            imageCount = await image.imageCount()
        })

        it('Image Created', async () => {
            // SUCCESS
            assert.equal(imageCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'ID is Correct')
            assert.equal(event.imageHash, imageHash, 'Image Hash is Correct')
            assert.equal(event.description, 'Test Description', 'Description is Correct')
            assert.equal(event.paidAmount, '0', 'Paid Amount is Correct')
            assert.equal(event.author, author, 'Author is Correct')

            // FAILURE Image must have hash
            await image.uploadImage('', 'Test Description', {from: author}).should.be.rejected;
            // FAILURE Image must have description
            await image.uploadImage('imageHash', '', {from: author}).should.be.rejected;
        })
        
        it('List Images', async () => {
            const imageStructure = await image.images(imageCount)
            assert.equal(imageStructure.id.toNumber(), imageCount.toNumber(), 'ID is Correct')
            assert.equal(imageStructure.imageHash, imageHash, 'Image Hash is Correct')
            assert.equal(imageStructure.description, 'Test Description', 'Description is Correct')
            assert.equal(imageStructure.paidAmount, '0', 'Paid Amount is Correct')
            assert.equal(imageStructure.author, author, 'Author is Correct')
        })

        it('Testing Pay Feature', async () => {
            // Track the author balance before purchase
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

            // Wei is like Ethereums Pennies 1 Ether = 1,000,000,000,000,000,000 Wei
            result = await image.payImage(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

            // SUCCESS
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'ID is Correct')
            assert.equal(event.imageHash, imageHash, 'Image Hash is Correct')
            assert.equal(event.description, 'Test Description', 'Description is Correct')
            assert.equal(event.paidAmount, '1000000000000000000', 'Paid Amount is Correct')
            assert.equal(event.author, author, 'Author is Correct')

            // Check that author received funds
            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)

            let paidAmount 
            paidAmount = web3.utils.toWei('1', 'Ether')
            paidAmount = new web3.utils.BN(paidAmount)

            const expectedBalance = oldAuthorBalance.add(paidAmount)
        
            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            // FAILURE Tipping Image that does not exist
            await image.payImage(99, { from: author, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
        })
    })
})