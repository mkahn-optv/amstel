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
            size: { width: 100, height: 100 },
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
            size: { width: 25, height: 40 }
        },
        {
            name:              "Bud Board",
            appType:           "crawler",
            reverseDomainName: "io.overplay.budboard",
            buildNumber:       1,
            onLauncher:        true,
            iconLauncher:      'budboard16x9.png',
            publisher:         "overplay.io",
            size:              { "width": 100, "height": 10 }
        },
        {
            name: "Daily Specials",
            appType: "crawler",
            reverseDomainName: "io.overplay.dailyspecials",
            buildNumber: 1,
            onLauncher: true,
            iconLauncher: 'special16x9.png',
            publisher: "overplay.io",
            size: { "width": 100, "height": 10 }
        },
        {
            name:              "Slideshow",
            appType:           "fullscreen",
            reverseDomainName: "io.overplay.slideshow",
            buildNumber:       1,
            onLauncher:        true,
            iconLauncher:      'slideshow320x180.png',
            publisher:         "overplay.io",
            size:              { "width": 100, "height": 100 }
        },
        {
            name: "Squares",
            appType: "widget",
            reverseDomainName: "io.overplay.squares",
            buildNumber: 1,
            onLauncher: true,
            iconLauncher: 'football16x9.png',
            publisher: "overplay.io",
            size: { "width": 25, "height": 40 }
        }


    ]


}