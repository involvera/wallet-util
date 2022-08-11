import { BIP39, BIP32, Buffer } from '../../ext_src'
import { PrivKey } from '.'


export default class Mnemonic {
    
    static IsValidMnemonic = (mnemonic: string): boolean => BIP39.validateMnemonic(mnemonic)
    static NewMnemonic = () => new Mnemonic(BIP39.generateMnemonic())
    private _mnemonic: string
    constructor(mnemonic: string){
        if (!Mnemonic.IsValidMnemonic(mnemonic)){
            throw new Error("Invalid mnemonic")
        }
        this._mnemonic = mnemonic
    }

    get = () => this._mnemonic
    private seed = () => new Buffer(new Uint8Array(BIP39.mnemonicToSeedSync(this.get())))
    private master = () => BIP32.fromSeed(this.seed())

    wallet = () => new PrivKey(this.master()).derive('m/0/0')

    deriveForContent = (nonce: number): PrivKey => new PrivKey(this.master()).derive('m/1/' + nonce.toString())
}