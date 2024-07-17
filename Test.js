// =================== Scratch extension =================== 

// auto arguments is a little over complicated to deduce argument count

const letter = i => String.fromCharCode(97 + i);

const auto_block = (blockType, opcode, text, args) => ({
    blockType,
    opcode,
    text,
    arguments: Object.fromEntries(
        new Array(text.split('[').length - 1).fill().map((_, i) => [
            letter(i), {
                type: (args && args[i]) || "number",
                defaultValue: " "
            }
        ])
    )
});

const mat_reporter_f = f => o => to_s(f(...new Array(Object.entries(o).length).fill().map((_, i) => from_s(o[letter(i)])));

class ScratchMath {

    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: "WECTE",
            name: "WE Coin Tools Extension",
            blocks: [
                auto_block('reporter', "Fetch", "Fetch [a]"),
                {
                    blockType: 'command',
                    opcode: 'EvalCmd',
                    text: 'Run [a] in Javascript',
                    arguments: {
                        a: {
                            type: "string",
                            defaultValue: " "
                        },
                        b: {
                            type: "string",
                            defaultValue: " "
                        }
                    }
                },
                auto_block('boolean', "isWE", "Is WE Coin?"),
                '---',
            ]
        };
    }

    EvalCmd({ a }) {
        try {
            eval(a);
        } catch (err) {
            alert(err);
        }
    }

    Fetch({ a }) {
        let file = a;
        return fetch(file)
            .then(x => x.text())
            .then(y => {
                let ans = y;
                return ans;
            });
    }

    isWE() {
        return true;
    }
}

// ============== globalize vm and load extension ===============

function findReactComponent(element) {
    let fiber = element[Object.keys(element).find(key => key.startsWith("__reactInternalInstance$"))];
    if (fiber == null) return null;

    const go = fiber => {
        let parent = fiber.return;
        while (typeof parent.type == "string") {
            parent = parent.return;
        }
        return parent;
    };
    fiber = go(fiber);
    while (fiber.stateNode == null) {
        fiber = go(fiber);
    }
    return fiber.stateNode;
}

window.vm = findReactComponent(document.getElementsByClassName("stage-header_stage-size-row_14N65")[0]).props.vm;

(function () {
    var extensionInstance = new ScratchMath(window.vm.extensionManager.runtime);
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance);
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName);
})();
