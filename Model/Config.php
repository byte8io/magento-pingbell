<?php
/**
 * Copyright © Byte8 Ltd. All rights reserved.
 * See LICENSE.txt for license details.
 */

declare(strict_types=1);

namespace Byte8\PingBell\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Encryption\EncryptorInterface;

class Config
{
    private const XML_PATH_ENABLED = 'byte8_pingbell/general/enabled';
    private const XML_PATH_API_KEY = 'byte8_pingbell/general/api_key';
    private const XML_PATH_EVENT_PREFIX = 'byte8_pingbell/events/';
    private const XML_PATH_PINGBELL_ID_SUFFIX = '_pingbell_id';

    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly EncryptorInterface $encryptor
    ) {
    }

    public function isEnabled(): bool
    {
        return $this->scopeConfig->isSetFlag(self::XML_PATH_ENABLED);
    }

    public function getApiKey(): string
    {
        $value = (string) $this->scopeConfig->getValue(self::XML_PATH_API_KEY);

        return $value ? $this->encryptor->decrypt($value) : '';
    }

    public function getPingBellId(string $eventKey): string
    {
        return (string) $this->scopeConfig->getValue(
            self::XML_PATH_EVENT_PREFIX . $eventKey . self::XML_PATH_PINGBELL_ID_SUFFIX
        );
    }
}
