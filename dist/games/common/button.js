var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Button_image, _Button_text, _Button_sound;
import Phaser from 'phaser';
var Image = Phaser.GameObjects.Image;
export class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, key, soundKey, callback) {
        super(scene, x, y);
        _Button_image.set(this, void 0);
        _Button_text.set(this, void 0);
        _Button_sound.set(this, void 0);
        __classPrivateFieldSet(this, _Button_image, new Image(scene, 0, 0, key), "f");
        __classPrivateFieldSet(this, _Button_sound, scene.sound.add(soundKey), "f");
        __classPrivateFieldGet(this, _Button_image, "f").setInteractive();
        __classPrivateFieldGet(this, _Button_image, "f").on('pointerdown', () => {
            __classPrivateFieldGet(this, _Button_image, "f").y += 4;
            __classPrivateFieldGet(this, _Button_text, "f").y += 4;
        });
        __classPrivateFieldGet(this, _Button_image, "f").on('pointerup', () => {
            callback();
            __classPrivateFieldGet(this, _Button_sound, "f").play();
            __classPrivateFieldGet(this, _Button_image, "f").y -= 4;
            __classPrivateFieldGet(this, _Button_text, "f").y -= 4;
        });
        __classPrivateFieldGet(this, _Button_image, "f").on('pointerover', () => {
            __classPrivateFieldGet(this, _Button_image, "f").setTint(0xcccccc);
            const hoverSound = scene.sound.add('hover-se');
            hoverSound.play();
        });
        __classPrivateFieldGet(this, _Button_image, "f").on('pointerout', () => {
            __classPrivateFieldGet(this, _Button_image, "f").clearTint();
            if (__classPrivateFieldGet(this, _Button_image, "f").y > 0) {
                __classPrivateFieldGet(this, _Button_image, "f").y -= 4;
                __classPrivateFieldGet(this, _Button_text, "f").y -= 4;
            }
        });
        __classPrivateFieldSet(this, _Button_text, new Phaser.GameObjects.Text(scene, 0, 0, text, {
            color: '#000000',
            fontSize: '30px',
            fontFamily: 'pixel',
            fontStyle: 'bold'
        }), "f");
        const { width, height } = __classPrivateFieldGet(this, _Button_text, "f");
        __classPrivateFieldGet(this, _Button_image, "f").displayWidth = width + 50;
        __classPrivateFieldGet(this, _Button_image, "f").displayHeight = height + 50;
        __classPrivateFieldGet(this, _Button_text, "f").x = -width / 2;
        __classPrivateFieldGet(this, _Button_text, "f").y = -height / 2;
        this.add(__classPrivateFieldGet(this, _Button_image, "f"));
        this.add(__classPrivateFieldGet(this, _Button_text, "f"));
        scene.add.existing(this);
    }
    setText(text) {
        __classPrivateFieldGet(this, _Button_text, "f").setText(text);
        const { width, height } = __classPrivateFieldGet(this, _Button_text, "f");
        __classPrivateFieldGet(this, _Button_image, "f").displayWidth = width + 20;
        __classPrivateFieldGet(this, _Button_image, "f").displayHeight = height + 20;
        __classPrivateFieldGet(this, _Button_text, "f").x = -width / 2;
        __classPrivateFieldGet(this, _Button_text, "f").y = -height / 2;
    }
}
_Button_image = new WeakMap(), _Button_text = new WeakMap(), _Button_sound = new WeakMap();
//# sourceMappingURL=button.js.map