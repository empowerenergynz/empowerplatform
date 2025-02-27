<?php declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Retailer;
use Illuminate\Database\Seeder;

class RetailerSeeder extends Seeder
{
    public function run(): void
    {
        /*
         * To run this migration a 2nd time in production:
         *  - ECS → Run Task
         *  - Launch Type: Fargate
         *  - Deployment Configuration: Task, family=<project>-<env>-artisan
         *  - Subnets: PrivateSubnetA, SubnetA, SubnetB
         *  - Security Groups: EFS, ECS, RDS
         *  - Container Overrides: bash,-c,php artisan cache:clear; php artisan db:seed --class RetailerSeeder
         *  NOTE - as yet this script doesn't delete/disabled retailers who are no longer in this list...
         */

        $retailers = [
            // these are the details we need in the CSV export of Bill Credits
            // _i = first initial, _j = 2nd initial
            // Trading name	             BankAccount Name	                 BankAccount Number	     Particulars     Code	             Reference     Email                       Can Allocate Credit Can Donate
            ['Contact Energy',           'Contact Energy',                   '01-1839-0942743-01',   '',             '',                 '_accountNo', null,                       true,               true,],
            ['Genesis Energy',           'Genesis Energy Ltd',               '03-0502-0244320-00',   '',             '',                 '_accountNo', null,                       true,               true,],
            ['Mercury',                  'Mercury NZ Limited',               '12-3013-0893681-00',   '_accountNo',   '_i_j _surname',    '',           null,                       true,               true,],
            ['TrustPower',               'Trustpower',                       '01-1839-0329105-01',   '_surname _i_j','_accountNo',       '',           null,                       true,               true,],
            ['Meridian Energy',          'Meridian Energy',                  '03-0502-0233680-07',   '_name',        '',                 '_accountNo', null,                       true,               true,],
            ['Powershop',                'Powershop',                        '03-0502-0367558-003',  '',             '_accountNo',       '_name',      null,                       true,               true,],
            ['Frank Energy',             'Frank Energy',                     '03-0584-0225333-00',   '',             '',                 '_accountNo', null,                       true,               true,],
            ['Nova Energy',              'Nova Energy Ltd',                  '06-0193-0245097-05',   '_name',        '',                 '_accountNo', null,                       true,               true,],
            ['Pulse Energy Alliance',    'Pulse Energy Alliance LP',         '02-0108-0333798-029',  '_i_j _surname','',                 '_accountNo', null,                       true,               true,],
            ['Grey Power',               'Pulse Energy Alliance LP',         '02-0108-0333798-029',  '_i_j _surname','',                 '_accountNo', null,                       true,               true,],
            ['Just Energy',              'Pulse Energy Alliance LP',         '02-0108-0333798-029',  '_i_j _surname','',                 '_accountNo', null,                       true,               true,],
            ['Electric Kiwi',            'ELECTRIC KIWI LIMITED',            '02-0108-0514003-002',  '',             '',                 '_accountNo', 'info@electrickiwi.co.nz',  true,               true,],
            ['Slingshot',                'Slingshot',                        '02-0290-0334411-000',  '',             '',                 '_accountNo', null,                       true,               true,],
            ['Orcon',                    'Orcon Limited',                    '02-0290-0395011-000',  '',             '',                 '_accountNo', null,                       true,               true,],
            ['Flick Electric',           'Flick Electric Co',                '03-0584-0341115-000',  '',             '',                 '_accountNo', null,                       true,               true,],
            ['Ecotricity',               'Ecotricity Limited Partnership',   '38-9018-0841909-00',   '',             'CC_year',          '_accountNo', null,                       true,               true,],
            ['Glo-Bug',                  'Globug',                           '12-3109-0018179-12',   '',             '',                 '_accountNo', 'helpdesk@globug.co.nz',    true,               true,],
            ['Octopus Energy',           'Octopus Energy',                   '30-2904-0401842-062',  '_surname',     '',                 '_accountNo', null,                       true,               true,],
            ['Wise Prepay Energy',       'WISE Prepay',                      '06-0541-0504738-000',  '',             '',                 '_accountNo', null,                       true,               true,],
            ['Prime Energy',             'Prime Energy Limited',             '12-3403-0000586-50',   '',             '',                 '_accountNo', null,                       true,               true,],
            ['2Degrees',                 '2degrees',                         '02-0108-0659253-000',  '',             '',                 '_accountNo', null,                       true,               true,],
            ['Nau Mai Rā',               '',                                 '',                     '',             '',                 '_accountNo', null,                       false,              true,],
        ];

        foreach ($retailers as $retailerRow) {
            $retailer = Retailer::whereName($retailerRow[0])->first() ?? new Retailer();
            $retailer->name = $retailerRow[0];
            $retailer->account_name = $retailerRow[1];
            $retailer->account_number = $retailerRow[2];
            $retailer->particulars = $retailerRow[3];
            $retailer->code = $retailerRow[4];
            $retailer->reference = $retailerRow[5];
            $retailer->email = $retailerRow[6];
            $retailer->can_allocate_credit = $retailerRow[7];
            $retailer->can_donate = $retailerRow[8];
            $retailer->save();
        }
    }
}
