const ContractsService = require('../services/contracts')

const contractsService = new ContractsService()

async function getContractsById (req, res) {

    const {Contract} = req.app.get('models')
    const {id} = req.params

    const contract = await Contract.findOne({where: {id}})
    console.log('id', id)
    if(!contract) return res.status(404).json({ error: 'contract not found' })
    if(contract.ClientId !== req.profile.id && contract.ContractorId !== req.profile.id) { 
        return res.sendStatus(403);
    }
    res.json(contract).end();

}

async function getContractList (req, res) {
    const profileId = req.profile.id; 
    const contracts = await contractsService.getContractList(profileId);
  
    res.json(contracts);
  }

module.exports = { getContractsById, getContractList }