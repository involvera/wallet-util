import { BIP39, BIP32 } from '../../ext_src'
import {InvBuffer, PrivKey} from './'
import {wordlist} from '../../ext_src/bip39/src/wordlists/english'

export default class Mnemonic {
    
    static isValid = (mnemonic: string): boolean => BIP39.validateMnemonic(mnemonic, wordlist)
    static random = () => new Mnemonic(BIP39.generateMnemonic(wordlist))
    private _mnemonic: string
    
    constructor(mnemonic: string){
        if (!Mnemonic.isValid(mnemonic)){
            throw new Error("Invalid mnemonic")
        }
        this._mnemonic = mnemonic
    }

    copy = () => new Mnemonic(this.get())
    buffer = () => InvBuffer.fromRaw(this.get())
    get = () => this._mnemonic
    private seed = () => new InvBuffer(new Uint8Array(BIP39.mnemonicToSeedSync(this.get())))
    private master = () => BIP32.fromMasterSeed(this.seed().bytes())

    wallet = () => new PrivKey(this.master()).derive('m/0/0')

    deriveForContent = (nonce: number): PrivKey => new PrivKey(this.master()).derive('m/1/' + nonce.toString())
}