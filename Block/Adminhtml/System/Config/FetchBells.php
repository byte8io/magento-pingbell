<?php
/**
 * Copyright © Byte8 Ltd. All rights reserved.
 * See LICENSE.txt for license details.
 */

declare(strict_types=1);

namespace Byte8\PingBell\Block\Adminhtml\System\Config;

use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Data\Form\Element\AbstractElement;

class FetchBells extends Field
{
    protected $_template = 'Byte8_PingBell::system/config/fetch_bells.phtml';

    public function getAjaxUrl(): string
    {
        return $this->getUrl('byte8_pingbell/config/fetchBells');
    }

    protected function _getElementHtml(AbstractElement $element): string
    {
        return $this->_toHtml();
    }

    protected function _decorateRowHtml(AbstractElement $element, string $html): string
    {
        return '<tr id="row_' . $element->getHtmlId() . '">' . $html . '</tr>';
    }
}
