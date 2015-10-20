module.exports.stockapps = {

    /***************************************************************************
     *                                                                         *
     *   Stock apps that will always be installed                              *
     ***************************************************************************/

    apps: [
        {
            name: "App Picker",
            appType: "fullscreen",
            reverseDomainName: "io.overplay.apppicker",
            buildNumber: 1,
            onLauncher: false,
            isMain: true,
            currentFrame: {"top": "0", "left": "0", "width": "100%", "height": "100%"},
            publisher: "overplay.io"
        },
        {
            name: "Shuffleboard",
            appType: "widget",
            reverseDomainName: "io.overplay.shuffleboard",
            buildNumber: 1,
            onLauncher: true,
            iconLauncher: 'shuffle320x180.png',
            publisher: "overplay.io",
            currentFrame: {"top": "0", "left": "0", "width": "25vw", "height": "40vh"},
        },
        {
            name: "Daily Specials",
            appType: "crawler",
            reverseDomainName: "io.overplay.dailyspecials",
            buildNumber: 1,
            onLauncher: true,
            iconLauncher: 'special16x9.png',
            publisher: "overplay.io",
            currentFrame: {"top": "0", "left": "0", "width": "100vw", "height": "10vh"}
        },
        {
            name: "Squares",
            appType: "widget",
            reverseDomainName: "io.overplay.squares",
            buildNumber: 1,
            onLauncher: true,
            iconLauncher: 'football16x9.png',
            publisher: "overplay.io",
            currentFrame: {"top": "0", "left": "0", "width": "25vw", "height": "40vh"},
        }


    ]


}