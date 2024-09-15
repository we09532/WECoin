(function(Scratch) {

'use strict';

if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
}

class CombinedExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.PreviousBal = 0;
        this.CurrentBal = 0;
        this.checkInterval = null;
        this.user = '';
        this.variables = {};
    }

    getInfo() {
        return {
            "blockIconURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAADUCAYAAADk3g0YAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABaDSURBVHhe7Z1PbF3HdYcf5Vpq6aZoI6duDASQu4jhIC5QyAXqbkgi3WbTruqua3vZdRtAImBknawSyAujm3Rlb5Jlg0du6iwso4ANq9aiVhEghR3LSKtGqWWI7Pwu71DDx/tn/pwzc2bu+YDBu++KIvn45nvnzJmZe7eOj49Xijh2+0eXzXPX+0dFECpUPqwQ3aP5u+90z3q2traGJPLGfL+D/hDf67A/tODfTv9d4UOF4sFKcw2PqbJQAekc2VQyBlSodETK44tKRosKFc6pQLXJ44sjmY7TAlGh/GheojFUrjBUqGl2lyjRBPv9o8o1ggp1HpXID5VrABXqBFESHRycrwscHh6udnYeVdp3d0X5rnL1LF2orCJBFIhhj12GJArBFcw9hoSZ5YNcixVrqUKxi2TlsaKkCkPB9esn/TyTZIsUa2lCsYhkZdnfP8l8JMjjA6SyYjFKtiyxINQC2u7R0dHaPJKxXq+PTQfEp1FTzUSxrjGAbzr03jTVBk821EhFalWiscYkV9NiDZ5soJGJtDSJxhqDXE2KNXiy4kYikko03ajk6t8rjGuH3ssq2+DJSlvyO4xOoiKFNaKo1Uy0GjxZWUuOSugUQ51Fm38jEKsJqQZPVtSS3kUVib4tXazBkxW0pKikIvG3RLGqlWrwpPAW/U6pSPnb0sQaPCm0RUclFal8SxCrKqkGTwpsUe+Glr/ltdbFGjwprEW9AxqV5LaWpRo8KagF/+U1KtXR8B7hvYpAtFSDJyW0mPGSRqX6WmS0EivV4MnSLVSmVqPS9uWL59qTzz4xeB5t6HvU0GKiVd9HBvtPySZtP1TwfiXsQTKfcv2zenjq+S91j39oHp/65qNjCj557173+PH7J4/3Pvzv1Z2bv+6OJYP38dq17vKGIeyZJmYDmiShINH65HAebOKDTDVs5rPyPP83T3ePVOKE8OSXvlhd/t0vVgc3ftk9/+jmfZGSmWjVSYXHAMRIJUUohBjvjyZItLeHv6FMXIFKyDOFFctypxdLmmAR0UrEzmAJQgXJJDXFg0QlI1AI2xePVtuXHp4Ry2Ij2Lp/LEmNUpUWqmqZJEciHzaj1SYS5KpNqpJCVSuTjUY1SjTEnFgAcpUSqyapSgkVJBPGSxKKD8+/9PRpWtcaPlKBUlGrFqlKCBVUzSstU2vRaAqMrS4bsbYvPuzPjFNCLFT+1mvvrgOyV/9yC+UtU+my+JJE2sQ3WoESYkGqgLJ6VqlyC+X1w0qWxZcskkuIVCC3WL5Smf6N2/Fk60zZhDI/Z+2zAqKkTC2PkWIIlQrkLF5IlCqXUF5FiFIyaVQaB+Oqr13+v/6ZP7nEkiZVDqG8K3rmBfdHeVCR/Pna5c+9ihUudhUGp1iBhQr2yh+3UN4y5a7maXoXTkwKCLijlSSpLvSPHHjLlLuapzLF8em9x1f3HzzWP/Nn9+WvrPbf+cbqytUn+jO0BA4V0CfZhHqMcfWB10dGzhUQSPFe/PtnVn/8rSf7M0oo//Ob31ptXzpaPf5YeGbzp9/+/RWSeqSC1Ny5c6cbMviMpwz4Itz57k73jBAuofBNZ19ZTpkQlf7cyPTEU5f6M0osKVIhSnFJhUjlK5UZ6lwxX/tP/VMyOITCN5xN9XLK9JfffVajEjGpUu2ZNBBS/eq/wsdkU/hKZb7mCh5MIx1rcBQlZr9hLpm0isdPTPXPhatg4VtON2DwRSYVtVCz0SlwABkNZPqWiUw18t4//6I/CqdEseXZr6albyWlMv2fdH6KUiivVC9HebxmmcCPvv1OfxRGqdcdO/nrwiEVZPIsp5OV0inL5l7jJm6ZUHyoWaYauf/gwuru/z7eP4sDpXWMqyhBX0Of8wB91ys/nINKqFm78eK4x006v1QOzFFJlAp9zudD3GRqswHBB4qUT0yqFwLSI1uskCZhbSmfS2qRAqD698YrdFNEOVO/1AiFMCki1Qvl4/furd770S9OWkIRQDnLXROpUrlydZs0UuVM/ZKE8gmTOVK9VCAVooK9QKQSD8ZTP7/72/2zeKjTv1ypX4pQ17c89jd5fjKI4F/+4cP+SEkBUsWs+duEWiqfvtj36egolSJUlaneHD9VqUj4+V2aJV6UUvmmfilRKlao2RwOv7j0VG8IjK009aOBIvUDlFL5pH4pUSpWqFmDa5TJYi+yr6RBlfoBSEW1/YMzSsUI5RWdakYjFB0UVT9LztQvNkrFzEPN/gfzy/RHdVJ6PqfmeaghYnf6DkE5RzXX982/B6/zC41QzUen2pEYXWN3+g5BOUfFEaVCI1Tz0QmUXsIUG6GGQNQCdlUIbu5WYjsLxQJalzde+U8TrdJvv0MdpUI2GOILJ22F8bWVyYdAJ7QdMQeIKj/7/p3VRz+9u/rZ92h3Zf/6kwddw89A+w/zM7AypFsdYj77Pnn/XrfLjnsn8xcPt6I3JA7xB09fXP3bT37VP4sHAWBqi4f5d2xE9N4uHxKhFhGdwEs/fqE/4gOdG50aZXopIDJ3j0zRmTpKUW35oIxSvmOoxYydbKfiwEqElA6rMiTJBOzaRvx+HOsbKcvogKqUTjmW8o1Qi4hOXGMnidHIF/xNKMdd1FGKqupHFaV8ItQiohOXTBBJYjTyBRGLsohBHaWoqn5UUconQkGoyVnjmqMTig8QibryVXNU2oR6TEkdpQBF1Y8iSk0KdevuTRi5vnX33ZMTA6Cqd3BYX2WPs3wMkfDJ3gJckTv1wi6bUKR+qHh73CVxMnoMCvXm7RvX37r9evSK2yXTkkyASyjK1ROW1CjlubMXEWo0gpwZQyEivfavr65Vpjiw9aMlmQCHTOD+53TjKEvqWKrLtmbmUU0AmnTjVChEpdfefnV967MuzVMCgUwtjJdyQV2cAChQpJbRPYsTo5wKpVEpnlaKD5sg3eOEciW6hSJKeTAqVScUolP3TAmmtTFTThClqKGIUilpX/eKNDrF0ZXGG5aJa/zkQp32gdQolTIndaEvjSsRtHxRl1yLgznSvtQo5Zn2DXLhAxUqCqR6LZNriwdH2ge4x1JjaR/Pq1kAJVI9u62kmxvaaPbfckUWSjjSvtQoFZv2bX3w6Tu7KJf3zxUPchUiOnn6cUxMxMAYz15wJvT3zbGFxcKxFAmkrp6YWkXUc26SVyNUBOio3OCui7g+BESKTb/w/yAkGgRBsxFtitxRjivtQ5RKISbtu/Dc5avxI7CFwjnnhM6Mjs81hnEFG5OL62dPwZH2gQxp3xm6j4bvvPhDr92ICn8xIudVizblapGU4kTMJG8nFKLUc1/WSFWakp36TNQyx7nhKJ8D7rRvk9Pk9Tt/8cM9lWoezmJEiY68iYTfgZrUlRNTbI6jzowG//HFH6z++usv98+UnNRY7qaEqzABUtK+uXHUJmdeBQZZf/X1v8OYqhPLpIL9vyjclCgESIOvMJGW9k2xWZhwNxjiHybno8x/7o/KgE9x2/FKXLAR5XKu5UZ4bRIvo5wTjk2HlpTNhyHzUW6EOlcCdElZ30QFytUYw6ChY7e+/GdpcGw6tGSo9nV4J66Hh7h4piwgViu38sSHRQuvo0Xm+r5bmDgVypzc6Q+ro5VItfSIy1mYSBlHRUWooVlfF8k3UOtSwQY6YyuvQypc5XPXHSvUpEw1gPSPO2XKUQTpxogLloqr0geeiYxSISsmvISSUJBYEnZsqNGKlhybDr2SVokFiSFydMCcE7BLj1bUpIyjPBw4E6EUT3LPfS0tWv2GsTABOJchARUqEEwol8AVS6NWfuZSPlsl74SaK5nXMobKET3wM0quu+vSQNO6q9SqWOLQCFUpdtWIFi/CiK30+dKUULm2Hkjb4mDFaiFqcS4/AtxjKLs4dnL1X+lFsT7k3hjXjWVMR5YK/h6l7vieAtcFWywpF27pXZliqwmhSu0yreEGAXaFfi0bB7mFAtde+KA/CsNHqOpTvlIygRo6qY618lKtUPjkxaW2Snbq7pPfCF0LKlYaHtXu3a03P7yBTYWjS4/wTSTd8tPOA0kaG0gfT41RMrqPwbnJ0BK72RB3N8RdDifY23rpxy/MJobKPLVKBSSJVbtQOg9FBDpkTemfCz4INA2kQYUipHapULXUXcNpqFDE1CwVKoK4VkdJqX7n4lF/JA+fFecqFAOQqubLG+sFcIbZ2Zm9SsSBCsWIjquWhwrFTM3RClLlTv+2Lz7sj+pEhcpErWJplHrETMkcaMqXm9rEynklJqzjqx0VqhCuWNLlypX6bV/Kk+7FXpLZBxWqMF3hooKopamfHyqUIKxY3aJfYXIh9eOOUpLnoObGT8fHx92CVxVKIHb/krSUkDtK1V7hAyqUcCSlhDmiFDfYscuJClURrlglr7zEAVaZS2Yu5dva2urWJalQFQKxcHO2EhGr9uIEZ4UPqFAVUyIVRNrHAfceqFxsffDpO7vHJqJtrVZn7mbtcnBwuNrfl3s7m03sbt4ar/oTCyIH5otygCok5d81x4VZLIybC3F36+v2qkf4StH3140Fn974JF8CKBhw3QPYhVqoHLt0LYxXPOrus2tTvvmrT8yvYxIJPrWXcmESdHJ0dqUIZ+eh7MRUq5RYOV0CSMU9pvr4fdq/Y67oFFsyn7t7p+uOd1Gi1gjlspTlM6XuEBJDznI5V4XPlszBqVDmJAZVo3jsVhRPCxOTPiBKtTZPRcFHkREqpO8vKkKBpUSpWshZLo+NUB59fzDla7YwsUQoq3Bc5E334qKTZ58fHkO1XpgAXBOTS4JqjJZzdTlXdNp0xjvlA9eujc79KsKQPlbEZG7O1eWx46c53IIEOCPUXGFCOYvkTssZiSnSyVy7cy2xESq0GBcUoVoYQ1HO0WBVgsRJY87fh6p6mLMYcXDjl/1ROCEFCbAplBYmPHE7rbsao7Rc3e/AuKaPIjpJ36phmZvQ7ZkeQ80VJmoeR3Gv60NHduXKnRLi53HKBCgKErlXlq8TItQUQ67YxbEuCEFNLpTFVgcqfG8HmuuWnNyRyZL6N8y5EBYg3YsVasCNTboV5ieHJwSNoSy1pX32boeU+A768XU2arlpIUX0wveA2N33zSATxfgzd3SKxTPdO/dFQxEKZq5NFBq1Bnc13NvDanX5cKR5lNHADvI3xyZjqRUWpkKkEvNptUUnELtdA0JNDW+Q7hlHzkkwKJRhNu37oz/5vf5IHlYgrtUCudIrSVB8MD37Vd4LpGySO90D3kLduntz9ebt10+PlwxSrKWh0ekcg4WEsTHUAUJaf7x6y4j02tuvdiItXaYlUuPYKWXuyYPRBRCjRQm7agIyvXn7RndOOUn3lgRFqlfLvJMlZWpoqsp3oDIpFDKViE6xY6fY6p5lsmyuMp1nScUIiqkGydcrj2RyveuoUEYmL1WVNkGql1olRXTKfb3ylOgEUlcCjQp169N369/zTsxSxk+ITKmpHrZn1DKJa0lN98C4UJ/drGs5hEIC1TX3LhcqRDBHp8l0D0yOoZSztDx+wooNzDVRyFQi1QMppXLP6DTLqFDPffnq7FaOJZF75XhOMF7CzQcoKFHVA5nGTrPWaYTyBJ/c+ASnmOSUgo1KqeMll1LjphSZPKPTbLoHxpYedVW+t26/nlbyaJia1/NBJEhEvdax1ujksW4PeO1ZGhUK/O1P/szrJy0ZW/mrQS4ukUApmXB5sDdeudM/C8dz3R6ik1cYmxTq1t2bu6+9/erkqnPlEd22ivf5d82GwCmRpZRMQFJ0ApNCAU394rHRK+f+JSsQ4JTIUrNM1NEJzAoFVCo63MlhWzmkki11i0UoOW+UtklqqgeooxPwEsoCsbCCQid9+fC9VsUQOYUqKROIvROhhSM6gSChLOb/rP/9s3cnpbq+v786PKCbykL6QlnelUoNQpWWKTXVAxzRCUQJZZjdIs9x3QmKvTnSkS5UCzJxRScQO7F7ZkfvELgykueEmTeoni1lgapESsuEcVMmmUBU541eKeFzHXT84tSXHFOpylBaJpAqE/qip0yzfXuMlKVHs1EKeL6AICBVy2vrpCFBJqR6qbf09OmLfZ+OTq2S1vL5RCmO1A/gQv0KP5hnkiATRarnky359OkpUhfHwuYiqR/AAF7ho+SkrYVCpsBUL6k0nSoUuF4q9UM1TMdTPLQiEwiQKTmVohCqaOqnRQpaTsZLnzcjk2+qZyDpnCRCGYqmfioVDXa8VGK3rQuVTIGpHglUQoFiqR+AVDqmikdCVAJUMoGcqZ6FUijv1G+95tkRgjGVShUGUjxcxL90VAKUMuVO9SykQhm8Uj+8UI7xFFCp/EFUKl0St1DLlDvVs8Su5ZvEfM/J+0tZ9vf32cTCviCqC4/kJGXC2nf/k4QKnktBmcg7H4tQBsjklddxSgWorjPXAkjvcL08CemdJXUbhkuATCB4JbkPXEIBWOL16rAqHavTuVjCKvUpJIpkF7oWkoklOgFOoYBKVRCJIgHKFA8EFrrYZALcQgExUoElpIBSRQKUKZ4loA+zygRyCOVdpMh1M+xWo5VkkahTPAsik2d5nF0mkEUooFLxAIm2Lz3s7sMkUSRAneJZfGUyfW/wju0cZBMKSJMK1CqW5Ghk4YpKICAyAZaK3hBZhTLgL+A1eswpFahBrBoksnCMlQAkQjUvQCZ0It6BuUNuoYC3VCBHocIiTSoIBGqRCHCldwASBS5byyoTKCEU8K78Ae7J301KiOXKA2oRyMKZ3oEImbIUITYpJRQQLRWAWHsvf2V1//PHuuf3H6QvfbTi2EJCd1yZPC7cIoHASVtQRCZQUiggXioAqXZNc7n/4EQyH2oWZowcIoGaZAKlhQJVSAUg1pWrT5i23Z9ZHrlEArXJBCQIBaqRCkAssBm1WiWnRJbAsjgoLhOQIhQIqv6h8gexclUAx2g1akEikFukiLI4yF7NG0OSUCBIKlA6WrnUHrlKSWQJTfFM38UKCEQmETIBaUJ1mN/Ja0WFRUq0cqlFLpvOnRznlwjERKVepnwz/56IFKonaFwFJEWrTaxgoJRkbgQCpQRyiSg8iJUJSBYKBEslMVqNgbHXM/3YC8cnj+ljMSsOhPnIOZZE5FgJiCg+jAKhhDdcniwY88mHT4ommpFttA19vfSG9yYS/MehPiKmDZ4U2BYvVQvNRKPj9XrdvzvBiJcJbfCk4KZiVdpio9LR0REM3DVtqD+Ia4Mnhbe4d8agYuVvCekdqCIquW3wZCVNxRLcUkSqLSq5bfBkRS3t40/FIm+JEQlUF5XcNniywqZiFW6pItUcldw2eLLSlv7RqGIFNVTtCCISqDoquW3wZMVtt/+kSwKdROUab4nl71NaiUpuGzzZQCP52AQq10mjkgi0KJJtgycbamRigaXJRSkRaFkk2wZPNthIxQKtykUtEViCSLZJXxxLTfBiWx+wEPfw8PD0uIaFucDI0z3a1d72ORWmb4nbr8TN0oSysIjl4kpmIln3WBIrCx53dnbI5XFZokiWpQplYRfLxZUMuJEsNaptCmKfc8vjsmSRLEsXymJDSDa55nAFg4QQY5NcosyhIj1ChTqPOLkkohINo0JNo3I5qETzqFD+oPS+YzqUjDwrE45EQEWaQYWKo2m5VKJ4VKh0IFUnVo2SQR48qkA0qFA8iJRM5eFHhcrHqWQWyNYfopMnSWdlsZjvZye87HmVJwMqlFxcwXA8JIRKIorV6v8BMuIh/wMThtAAAAAASUVORK5CYII=", // Leave space for URI
            id: 'wecoinv3',
            name: 'WECoin',
            docsURI: '',
            color1: '#0088ff',
            color2: '#0063ba',
            blocks: [
                {
                    opcode: 'openOfficialWebsite',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'WECoin Official Website'
                },
                {
                    opcode: 'openOfficialWECoinAPI',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'Official WECoin API'
                },
                {
                    opcode: 'iswecoin',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Is WECoin?',
                    arguments: {},
                    disableMonitor: true
                },
                {
                    opcode: 'getwecoinusersarray',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Get All WECoin Users as an Array',
                    arguments: {},
                    disableMonitor: true
                },
                {
                    opcode: 'viewwecoinbal',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'View WECoin Balance of User [User]',
                    arguments: {
                        User: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'we09532'
                        }
                    },
                    disableMonitor: true
                },
                {
                    opcode: 'setupBalanceCheck',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Setup balance check for [USER] *Only supports one user at a time*',
                    arguments: {
                        USER: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'we09532'
                        }
                    }
                },
                {
                    opcode: 'whenBalanceChanges',
                    blockType: Scratch.BlockType.EVENT,
                    text: 'When Users balance changes',
                    isEdgeActivated: false
                },
                {
                    opcode: 'doesWeCoinUserExist',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Does WECoin user [USER] exist?',
                    arguments: {
                        USER: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'we09532'
                        }
                    }
                },
                {
                    opcode: 'getUserRequests',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Get User Requests for [User]',
                    arguments: {
                        User: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'we09532'
                        }
                    }
                }
            ]
        };
    }

    async iswecoin() {
        return 'True';
    }

    async getwecoinusersarray() {
        return Scratch.fetch("https://snapextensions.uni-goettingen.de/handleTextfile.php?type=read&filename=./textfiles/GandiBlockbit:")
            .then((r) => r.text())
            .catch(() => "");
    }

    async viewwecoinbal(args) {
        return Scratch.fetch(`https://snapextensions.uni-goettingen.de/handleTextfile.php?type=read&filename=./textfiles/GandiBlockbit:${args.User}`)
            .then((r) => r.text())
            .catch(() => "");
    }

    async setupBalanceCheck(args) {
        this.user = args.USER;
        await this.fetchInitialBalance();

        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        this.checkInterval = setInterval(() => this.checkBalance(), 1000); // Check every second
    }

    async fetchInitialBalance() {
        const url = `https://wecoin.vercel.app/api/balance/${this.user}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.PreviousBal = data.balance;

        } catch (error) {
            console.error('Error fetching initial balance:', error);
        }
    }

    async checkBalance() {
        const url = `https://wecoin.vercel.app/api/balance/${this.user}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.CurrentBal = data.balance;

            if (this.CurrentBal !== this.PreviousBal) {
                this.PreviousBal = this.CurrentBal;
                Scratch.vm.runtime.startHats('balanceExtension_whenBalanceChanges');
            }

        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    async doesWeCoinUserExist(args) {
        const url = `https://snapextensions.uni-goettingen.de/handleTextfile.php?type=read&filename=./textfiles/GandiBlockbit:${args.USER}`;

        try {
            const response = await fetch(url);
            const data = await response.text();
            return !data.includes("ERROR");

        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    async openOfficialWebsite() {
        window.open('https://we09532.github.io/WECoin', '_blank');
    }

    async openOfficialWECoinAPI() {
        window.open('https://wecoin.vercel.app/api', '_blank'); // Replace ' ' with the actual API URL
    }

    async getUserRequests(args) {
        const url = `https://snapextensions.uni-goettingen.de/handleTextfile.php?type=read&filename=./textfiles/GandiBlockbit:Requests:${args.User}`;
        return Scratch.fetch(url)
            .then((r) => r.text())
            .catch(() => "");
    }
}

Scratch.extensions.register(new CombinedExtension());

})(Scratch);
