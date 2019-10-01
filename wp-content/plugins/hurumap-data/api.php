<?

function register_routes()
{
    $namespace = 'hurumap-data';
    $endpoint = '/charts';
    register_rest_route($namespace, $endpoint, array(
        array(
            'methods'               => 'GET',
            'callback'              => 'get_charts'
        ),
    ));
    register_rest_route($namespace, $endpoint, array(
        array(
            'methods'               => 'POST',
            'callback'              => 'create_chart'
        ),
    ));
    register_rest_route($namespace, $endpoint . '/(?P<id>.+)', array(
        array(
            'methods'               => 'PUT',
            'callback'              => 'update_chart'
        ),
    ));
}

function get_charts()
{
    global $wpdb;

    $hurumap = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}hurumap_charts");
    $flourish = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}flourish_charts");
    $sections = $wpdb->get_results("SELECT * FROM {$wpdb->base_prefix}chart_sections");
    $response = new WP_REST_Response(array('hurumap' => $hurumap, 'flourish' => $flourish, 'sections' => $sections));
    $response->set_status(200);

    return $response;
}

function create_chart()
{
    global $wpdb;

    $wpdb->insert("{$wpdb->base_prefix}hurumap_charts", array('visual' => '{}'));
    $response = new WP_REST_Response(array('id' => $wpdb->insert_id));
    $response->set_status(200);

    return $response;
}

function update_chart($data)
{
    global $wpdb;

    $json = $data->get_json_params();

    $wpdb->update(
        "{$wpdb->base_prefix}hurumap_charts",
        array(
            'title' => $json['title'],
            'subtitle' => $json['subtitle'],
            'visual' => $json['visual'],
            'stat' => $json['stat']
        ),
        array('id' => $data['id'])
    );
    $response = new WP_REST_Response(array('result' => $wpdb->last_result));
    $response->set_status(200);

    return $response;
}

add_action('rest_api_init', 'register_routes');
