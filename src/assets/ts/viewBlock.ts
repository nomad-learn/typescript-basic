// @ts-ignore
import { createNewBlock, getBlockChain } from "./blockChain.ts";

const body: HTMLBodyElement = document.querySelector("body");


const init = (): void => {
    let count: number = 0;
    const addBlock = setInterval(() => {
        const block: NodeListOf<HTMLDivElement> = document.querySelectorAll(".block");
        if (block.length === 3) {
            clearInterval(addBlock);
            console.log(getBlockChain());
        }
        const { hash, previousHash }: { hash: string, previousHash: string } = createNewBlock(`${count}`);
        const div: HTMLDivElement = document.createElement("div");
        const span: HTMLSpanElement = document.createElement("span");
        const previous: HTMLDivElement = document.createElement("div");
        const current: HTMLDivElement = document.createElement("div");
        div.classList.add("block");
        span.classList.add("block__hash");
        previous.innerText = `prev_hash: ${previousHash}`
        current.innerText = `curr_hash: ${hash}`
        span.appendChild(previous);
        span.appendChild(current);
        div.appendChild(span);
        body.appendChild(div);
        count++
    }, 1500)
}


init()