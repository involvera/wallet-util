import * as bip39 from '../bip39'
import bip32 from '../bip32'
import { Buffer } from "../buffer"
import { PrivKey } from '.'


export default class Mnemonic {
    
    static IsValidMnemonic = (mnemonic: string): boolean => bip39.validateMnemonic(mnemonic)
    static NewMnemonic = () => new Mnemonic(bip39.generateMnemonic())

    private _mnemonic: string
    constructor(mnemonic: string){
        if (!Mnemonic.IsValidMnemonic(mnemonic)){
            throw new Error("Invalid mnemonic")
        }
        this._mnemonic = mnemonic
    }

    get = () => this._mnemonic
    private seed = () => new Buffer(new Uint8Array(bip39.mnemonicToSeedSync(this.get())))
    private master = () => bip32.fromSeed(this.seed())

    wallet = () => new PrivKey(this.master()).derive('m/0/0')

    deriveForContent = (nonce: number): PrivKey => new PrivKey(this.master()).derive('m/1/' + nonce.toString())
}