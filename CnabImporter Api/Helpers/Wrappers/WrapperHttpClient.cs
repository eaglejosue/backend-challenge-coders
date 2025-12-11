using Polly;

namespace Api.Helpers.Wrappers;

public class WrapperHttpClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<WrapperHttpClient> _logger;
    private readonly INotificationService _notification;

    public WrapperHttpClient(
        ILogger<WrapperHttpClient> logger,
        INotificationService notification,
        int timeoutInSeconds = 100)
    {
        var handler = new HttpClientHandler { AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate };
        _httpClient = new HttpClient(handler)
        {
            Timeout = TimeSpan.FromSeconds(timeoutInSeconds)
        };
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        _logger = logger;
        _notification = notification;
    }

    public async Task<TResponse?> GetAsync<TResponse>(
        string uri,
        string? accessToken = null,
        string? content = null,
        AuthorizationType authorizationType = AuthorizationType.Bearer)
    {
        var response = await SendAsync(HttpMethod.Get, uri, accessToken: accessToken, content: content, authorizationType);
        return JsonSerializer.Deserialize<TResponse>(response);
    }

    public async Task PostAsync(
        string uri,
        string? content = null,
        string? accessToken = null,
        AuthorizationType authorizationType = AuthorizationType.Bearer) =>
        await SendAsync(HttpMethod.Post, uri, accessToken, content, authorizationType);

    public async Task<TResponse?> PostAsync<TResponse>(
        string uri,
        string? content = null,
        string? accessToken = null,
        AuthorizationType authorizationType = AuthorizationType.Bearer)
    {
        var response = await SendAsync(HttpMethod.Post, uri, accessToken, content, authorizationType);
        return JsonSerializer.Deserialize<TResponse>(response);
    }

    public async Task PutAsync(
        string uri,
        string? content = null,
        string? accessToken = null,
        AuthorizationType authorizationType = AuthorizationType.Bearer) =>
        await SendAsync(HttpMethod.Put, uri, accessToken, content, authorizationType);

    public async Task DeleteAsync(
        string uri,
        string accessToken,
        AuthorizationType authorizationType = AuthorizationType.Bearer) =>
        await SendAsync(HttpMethod.Delete, uri, accessToken: accessToken, authorizationType: authorizationType);

    private async Task<string> SendAsync(
        HttpMethod httpMethod,
        string uri, string?
        accessToken = null,
        string? content = null,
        AuthorizationType authorizationType = AuthorizationType.Bearer)
    {
        HttpRequestMessage CreateRequest()
        {
            var request = new HttpRequestMessage(httpMethod, uri);

            if (!string.IsNullOrEmpty(accessToken))
            {
                request.Headers.Authorization = authorizationType switch
                {
                    AuthorizationType.Basic => new AuthenticationHeaderValue("Basic", accessToken),
                    _ => new AuthenticationHeaderValue("Bearer", accessToken),
                };
            }

            request.Headers.Add("Accept", "application/json");

            if (!string.IsNullOrEmpty(content))
                request.Content = new StringContent(content, Encoding.UTF8, "application/json");

            return request;
        }

        var codesRetry = new HttpStatusCode[] {
            HttpStatusCode.BadGateway,
            HttpStatusCode.GatewayTimeout,
            HttpStatusCode.RequestTimeout,
            HttpStatusCode.ServiceUnavailable
        };

        var response = await Policy
            .HandleResult<HttpResponseMessage>(r => codesRetry.Contains(r.StatusCode))
            .WaitAndRetryAsync(retryCount: 3, retry => TimeSpan.FromSeconds(Math.Pow(2, retry)), (response, _, retry, _) =>
            {
                var message = new StringBuilder();
                message.AppendLine($"Attemp: {retry}");
                message.AppendLine($"URI: {uri}");
                message.AppendLine($"HTTP Status Code: {response.Result.StatusCode}");

                _logger.LogError(message.ToString());
            })
            .ExecuteAsync(async () => await _httpClient.SendAsync(CreateRequest()));

        var result = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            _notification.AddNotification("WrapperHttpClient", !string.IsNullOrEmpty(result) ? result : response.ReasonPhrase!);

        return result;
    }
}

public enum AuthorizationType
{
    Basic,
    Bearer
}