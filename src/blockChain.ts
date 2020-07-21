import CryptoJS from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateBlockHash = (index: number,
        previousHash: string,
        data: string,
        timestamp: number): string => CryptoJS.SHA256(index + previousHash + data + timestamp).toString()

    static validateStructure = (aBlock: Block): boolean =>
        typeof aBlock.index === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number"
        && typeof aBlock.data === "string"

    constructor(index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp
    }
}

const genesisBlock: Block = new Block(0, "20202020", "", "How", new Date().getTime())

let blockChain: Block[] = [genesisBlock];

export const getBlockChain = (): Block[] => blockChain;

const getLatestBlock = (): Block => blockChain[blockChain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

export const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, data, newTimestamp);
    const newBlock: Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp);

    addBlock(newBlock)

    return newBlock;
}

const getHashforBlock = (block: Block): string =>
    Block.calculateBlockHash(block.index, block.previousHash, block.data, block.timestamp)

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false
    } else {
        return true
    }
}

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLatestBlock())) {
        blockChain.push(candidateBlock);
    } else {
        console.error("Error:[Hash]")
    }
}