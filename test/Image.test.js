const { assert } = require('chai');
const Image = artifacts.require("Image");
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Image', (accounts) => {
    let image
    // Code that is run before all the tests
    before(async () => {
        image = await Image.deployed()
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
    describe('storage', async () => {
        it('imageHash Updated', async () => {
            let imageHash
            imageHash = 'test'
            await image.set(imageHash)
            const result = await image.get()
            assert.equal(result, imageHash)
        })
    })
})