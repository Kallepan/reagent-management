from rest_framework import renderers


class ResponseRenderer(renderers.JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        status_code = None
        if renderer_context is not None:
            status_code = renderer_context["response"].status_code

        message = None
        if data is not None and "message" in data:
            message = data["message"]
            del data["message"]

        data = {"data": data, "status": status_code, "message": message}

        return super().render(data, accepted_media_type, renderer_context)
