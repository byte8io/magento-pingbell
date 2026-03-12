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

    private ?AbstractElement $element = null;

    public function getAjaxUrl(): string
    {
        return $this->getUrl('byte8_pingbell/config/fetchBells');
    }

    public function getButtonId(): string
    {
        return $this->element->getHtmlId() . '_btn';
    }

    public function getResultContainerId(): string
    {
        return $this->element->getHtmlId() . '_result';
    }

    public function getTargetFieldId(): string
    {
        return str_replace('fetch_bells', 'pingbell_id', $this->element->getHtmlId());
    }

    protected function _getElementHtml(AbstractElement $element): string
    {
        $this->element = $element;

        return $this->_toHtml();
    }

    protected function _decorateRowHtml(AbstractElement $element, $html): string
    {
        return '<tr id="row_' . $element->getHtmlId() . '">' . $html . '</tr>';
    }
}
