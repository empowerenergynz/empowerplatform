<?php

declare(strict_types=1);

use PhpCsFixer\Fixer\ClassNotation\ClassAttributesSeparationFixer;
use PhpCsFixer\Fixer\FunctionNotation\ReturnTypeDeclarationFixer;
use PhpCsFixer\Fixer\Import\NoUnusedImportsFixer;
use PhpCsFixer\Fixer\Phpdoc\PhpdocAlignFixer;
use PhpCsFixer\Fixer\PhpUnit\PhpUnitMethodCasingFixer;
use PhpCsFixer\Fixer\Strict\DeclareStrictTypesFixer;
use PhpCsFixer\Fixer\FunctionNotation\PhpdocToReturnTypeFixer;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symplify\EasyCodingStandard\ValueObject\Option;
use Symplify\EasyCodingStandard\ValueObject\Set\SetList;

return static function (ContainerConfigurator $containerConfigurator): void {
    $parameters = $containerConfigurator->parameters();
    $services = $containerConfigurator->services();

    $parameters->set(Option::PATHS, [
        __DIR__ . '/app',
        __DIR__ . '/config',
        __DIR__ . '/database',
        __DIR__ . '/routes',
        __DIR__ . '/tests',
    ]);

    $parameters->set(Option::SETS, [
        SetList::CLEAN_CODE,
        SetList::SYMFONY,
        SetList::PSR_12,
        SetList::PHPUNIT,
    ]);

    $services->set(ClassAttributesSeparationFixer::class)->call('configure', [[
        'elements' => ['method' => 'one'],
    ]]);

    $services->set(PhpUnitMethodCasingFixer::class)->call('configure', [[
        'case' => PhpUnitMethodCasingFixer::SNAKE_CASE,
    ]]);

    $services->set(PhpdocAlignFixer::class)->call('configure', [[
        'align' => PhpdocAlignFixer::ALIGN_LEFT,
    ]]);

    $services->set(DeclareStrictTypesFixer::class);

    $services->set(NoUnusedImportsFixer::class);

    $services->set(ReturnTypeDeclarationFixer::class);
    $services->set(PhpdocToReturnTypeFixer::class);
};
