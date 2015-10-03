/**
 * Printing API Configuration
 * (sails.config.printing)
 *
 * These settings are for the global configuration for printing. These
 * settings are loaded automatically when sails starts and are available
 * everywhere via sails.config.printing.
 *
 *
 *
 */


module.exports.printing = {

    tracker: 'from config',

    printers: {

        mitsuD707DW: {

            args: {
                PageSize: [
                    'ME_9x13',
                    'ME_10x15', // 4x6
                    'ME_13x18', // 5x7
                    'ME_15x15',
                    'ME_15x20', // 6x8
                    'ME_15x21',
                    'ME_15x23',
                    'ME_10x15x2_T1',
                    'ME_10x15x2_T2',
                    'ME_10x15x2_T3',
                    'ME_5x15x2_T1',
                    'ME_5x15x2_T2'
                ],
                Resolution: '300dpi',
                ColorModel: 'RGB',
                MEAcceptKGwithA5: [
                    'True',
                    'False'
                ],
                MEOutputPlace: [
                    'AutoSelect',
                    'UpperPrinter',
                    'LowerPrinter'
                ],
                MESharpness: [
                    'none',
                    'Soft3',
                    'Soft2',
                    'Soft1',
                    'Normal',
                    'Hard1',
                    'Hard2',
                    'Hard3'
                ],
                MEMatteOP: [
                    'False',
                    'True'
                ],
                MEPrintMode: [
                    'Fine',
                    'SuperFine',
                    'UltraFine'
                ]

            } // end of args

        }
    }

}