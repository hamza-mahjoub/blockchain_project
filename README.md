# TRUTH dapp

## Introduction

Truth dapp is a distrubuted application created to provide to it's user a plateform for news sharing free from fake news leveraging the blockchain's consensus mechanism to ensure that.

Team members:

* Dorra Gara
* Hamza Mahjoub
* Wala Bahri
* Wassime Mekni Toujeni
* Ramzi Latrous

## Architecture

The application is composed of three major layers defined as the following:

* **front application**: a native js application using web three to ensure a web application that is able to reach the blockchain

* **Backend server**: an express application ensuring the connectivity of the front application to the IPFS network

* **IPFS node and blockchain's smart contracts**

The following diagram illustrates the relationship between the specified tiers and components of the application

![Architecture](./assets/blockchain%20architecture.drawio.png)

## Requirements

In order to have this application up and running in development local environment the following is required:

* Linux distribution (Ubuntu for example)
* Node
* Ganache local blockchain
* truffle
* IPFS
* Browser (FireFox for example)
* MetaMask

## Installation

Before getting into the set up of the servers you need to insure that you have ganache, truffle, IPFS and metamasek installed in your environment

### Ganache installation

To install ganache in your local machine visite ganache official [web site](https://trufflesuite.com/ganache/) and install ganache from there. Once this step is done we need to change the execution policy of the saved file and run it

```bash
> chmod a+x <path-to-installed-file>
> ./<path-to-installed-file>
```

### Truffle indtallation

having node and npm installed in you local environment use the folowing command to install truffle

```bash
> sudo npm install -g truffle
```

### IPFS Installation

The easiest way to do so is by downloading the latest .AppImage from the **IPFS Github Repository** and then execute the following commands

```bash
> chmod a+x ./ipfs-desktop-linux.AppImage
> ./ipfs-desktop-linux.AppImage
```

### MetaMask Installation

Metamask can be installed as an extension of your favorite browser. visit their extension store to find it

### Application setup

In order to have now the application up and running we need to: 

* **install dependecies of the TRUTH frontal application** using the following commands :

```bash
> cd TRUTH
> npm install
```

* **install dependecies of the IPFS Backend server application** using the following commands :

```bash
> cd ipfs
> npm install
```

* **Compile and Deploy smart contracts in the blockchain** using the following command

```bash
> truffle migrate --reset 
```

* **Start both of the servers**

  * frontend application:

    ```bash
    > cd Truth
    > npm start
    ```

  * backend IPFS server:

    ```bash
    > cd ipfs
    > npm start
    ```

## Disclaimer

For the next steps discussed in this project we can think of main two aspects to consider

* **Developing tests for the application smart contracts**

* **Deploying the application in a poblic blockchain** (Etherum public blockchain)
