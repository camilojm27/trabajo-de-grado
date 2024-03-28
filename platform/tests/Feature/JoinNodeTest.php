<?php

test('example', function () {
    $response = $this->get('/api/ping');
    $response->assertStatus(200);
});
