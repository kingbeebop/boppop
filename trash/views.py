def add_deprecation_header(response):
    response['Warning'] = '299 - "This API version is deprecated. Please migrate to the new FastAPI version."'
    return response 