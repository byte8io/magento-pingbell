define([
    'jquery',
    'Magento_Ui/js/modal/alert',
    'mage/translate'
], function ($, alert, $t) {
    'use strict';

    return function (config, element) {
        var $button = $(element),
            $resultContainer = $('#' + config.resultContainerId);

        $button.on('click', function () {
            var apiKeyValue = $('#' + config.apiKeyFieldId).val(),
                pingbellIdFieldId = config.pingbellIdFieldId;

            $button.prop('disabled', true).text($t('Fetching...'));
            $resultContainer.html('');

            $.ajax({
                url: config.ajaxUrl,
                type: 'POST',
                dataType: 'json',
                data: {
                    api_key: apiKeyValue,
                    form_key: window.FORM_KEY
                },
                success: function (response) {
                    $button.prop('disabled', false).text($t('Fetch Bells'));

                    if (!response.success) {
                        $resultContainer.html(
                            '<span style="color: #e22626;">' + $t(response.message) + '</span>'
                        );
                        return;
                    }

                    $resultContainer.html(
                        '<span style="color: #185b00;">' + $t(response.message) + '</span>'
                    );

                    // Build a select dropdown for choosing a bell
                    if (response.bells && response.bells.length) {
                        var $select = $('<select>')
                            .css('margin-top', '6px');

                        $select.append($('<option>').val('').text($t('-- Select a Bell --')));

                        $.each(response.bells, function (i, bell) {
                            $select.append(
                                $('<option>').val(bell.id).text(bell.name || bell.id)
                            );
                        });

                        $select.on('change', function () {
                            var selectedId = $(this).val();

                            if (selectedId) {
                                $('#' + pingbellIdFieldId).val(selectedId);
                            }
                        });

                        $resultContainer.append('<br>').append($select);
                    }
                },
                error: function () {
                    $button.prop('disabled', false).text($t('Fetch Bells'));
                    $resultContainer.html(
                        '<span style="color: #e22626;">' + $t('Request failed. Please try again.') + '</span>'
                    );
                }
            });
        });
    };
});
