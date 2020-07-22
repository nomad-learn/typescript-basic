# **타입스크립트로 블록체인을 구현해보자**

![](https://assets.coinmama.com/1.%20What%20is%20the%20purpuse%20of%20the%20blockchain.jpg)

**확인 할 부분**
- 해쉬함수로 반환된 값이 랜덤한지
- 반환된 값이 중복되진 않는지

<br/>

**목표**
- 특정 시간을 주기로 해쉬함수 실행 -> 변화되는 값 생성하기

<br/>

***
<br/>


**코드 설명**

```javascript

import CryptoJS from "crypto-js";// 데이터를 조합해 암호(랜덤한)를 만들 수 있는 라이브러리

// 어썸한 class를 보라... class는 타입으로도 사용이 가능하다... 어썸해..
// public은 Block class 자식(인스턴스)에서 접근 및 사용할 수 있다(ex> genesisBlock.hash 이런식으로 접근이 가능하다.)
// static은 자식을 만들지 않아도 바로 사용이 가능하다(ex> Block.calculateBlockHash 이런식으로 바로 접근가능. new Block() 어쩌구 노필요)
// constructor은 class 내에서 객체를 생성하고 초기화하기 위한 특별한 메서드다.
//(이게 무슨말인지 모르겠다. 코드보고 유추해보자면 매개변수들을 class내에서 사용할 수 있게 해주는 것 같은 느낌적인 느낌)
class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    // 이렇게 하는데 계산하는데 중복되는 값에 나올까 싶다..
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

// 이렇게 타입으로도 쓸 수 있고 생성자 함수로 사용할 수 있다
const genesisBlock: Block = new Block(0, "20202020", "", "How", new Date().getTime())

// Block이 들어가 있는 배열을 나타내는 타입이다 (genesisBlock는 Block이고 배열안에 담겨져있다)
let blockChain: Block[] = [genesisBlock];

// 설명이 필요 없을듯..
const getBlockChain = (): Block[] => blockChain;

// blockChain이라는 배열에서 맨 마지막 Block을 가져온다 (다음 블럭을 만들때 이전 블럭의 정보를 필요로 하기 때문에)
const getLatestBlock = (): Block => blockChain[blockChain.length - 1];

// hash함수에 최대한 일정치 않으며 계속 변화되는 값을 넣어서 중복되지 않은 hash값을 계산해낸다
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

// 대망의 새로운 블럭 만들기... 위 설명대로 이전 블럭의 정보들을 토대로 만든다
const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, data, newTimestamp);

    // 이전 블럭 정보로 새로운 블럭을 만든다 요호!
    const newBlock: Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp);

    addBlock(newBlock)

    // 굳이 return이 필요하진 않다 (void가능)
    return newBlock;
}

// 여기서 static의 활용사례가 나온다. 블럭이 유효한지 검사하는 함수에서 현재 만들어진 블럭의 hash값을 계산한다
const getHashforBlock = (block: Block): string =>
    Block.calculateBlockHash(block.index, block.previousHash, block.data, block.timestamp)

// 새로운 블럭이 이전 블럭 정보들을 토대로 만든다고 했기에 이전블록 정보와 새로운 블록의 정보를
// 비교하며 새로운 블럭이 유효한지 검사할 수 있다
const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {// 이 부분은 동일한 값을 넣었을 때 같은 
        return false                                                     // hash값을 계산해내는 가를 알아보는 구간이다
    } else {
        return true
    }
}

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLatestBlock())) {
        blockChain.push(candidateBlock);
    } else {
        // 블럭이 유효하지 않으면 에러 발생
        console.error("Error:[Hash]")
    }
}

```

<br/>

***
<br/>

**UI로 확인**
<br/>

이전 블럭의 해시값과 다음 블럭의 이전해시값이 동일<br/>
`Block-Chain`은 이렇게 블럭으로 연결-연결-연결하는 기술이다
<br/>
<br/>

<img src="./src/dist/blockChain.gif" />

<br/>

***
<br/>

### **출처 - 노마드코더 '타입스크립트로 블록체인 만들기'**

<br/>

관련 글

- <a href="https://www.investopedia.com/terms/b/blockchain.asp" target="_blank">Block Chain technology</a><br/>

관련 영상들

- <a href="https://youtu.be/SWqhXzC_9NA" target="_blank">Block Chain explain</a><br/>
- <a href="https://youtu.be/h7LU7_9XMUs" target="_blank">Youtube - Nomad Coders</a><br/>
- <a href="https://youtu.be/00XEba_m8xM" target="_blank">Youtube - 얄팍한 코딩사전</a><br/>
- <a href="https://youtu.be/ybJW3LF7pkU" target="_blank">Youtube - 쉽게 배우는 프로그래밍</a>