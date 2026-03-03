<?php
/**
 * Copyright © Byte8 Ltd. All rights reserved.
 * See LICENSE.txt for license details.
 */

declare(strict_types=1);

namespace Byte8\PingBell\Controller\Adminhtml\Config;

use Byte8\PingBell\Model\Config;
use Byte8\PingBell\Model\PingBellClient;
use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\Controller\Result\JsonFactory;

class FetchBells extends Action implements HttpPostActionInterface
{
    public const ADMIN_RESOURCE = 'Byte8_PingBell::config';

    public function __construct(
        Context $context,
        private readonly JsonFactory $jsonFactory,
        private readonly PingBellClient $pingBellClient,
        private readonly Config $config
    ) {
        parent::__construct($context);
    }

    public function execute()
    {
        $result = $this->jsonFactory->create();

        $apiKey = $this->getRequest()->getParam('api_key', '');

        // If the admin form sends the obscured placeholder, fall back to saved config
        if ($apiKey === '' || preg_match('/^\*+$/', $apiKey)) {
            $apiKey = $this->config->getApiKey();
        }

        if ($apiKey === '') {
            return $result->setData([
                'success' => false,
                'message' => 'Please enter an API key first.',
                'bells' => [],
            ]);
        }

        $bells = $this->pingBellClient->fetchBells($apiKey);

        if (empty($bells)) {
            return $result->setData([
                'success' => false,
                'message' => 'No bells found. Please check your API key.',
                'bells' => [],
            ]);
        }

        return $result->setData([
            'success' => true,
            'message' => count($bells) . ' bell(s) found.',
            'bells' => $bells,
        ]);
    }
}
