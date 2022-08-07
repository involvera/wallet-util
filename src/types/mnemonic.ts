import * as bip39 from 'bip39'
import * as bip32 from 'bip32'

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
    private seed = () => bip39.mnemonicToSeedSync(this.get())
    private master = () => bip32.fromSeed(this.seed())

    wallet = () => new PrivKey(this.master()?.derivePath('m/0/0'))

    deriveForContent = (nonce: number): PrivKey => {
        return new PrivKey(this.master().derivePath('m/1/' + nonce.toString()))
    }
}