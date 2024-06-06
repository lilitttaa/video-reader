import time


def retry_request(times: int, interval: int = 1):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print('retry request')
                    time.sleep(interval)
                    continue
            raise Exception('retry request failed')
        return wrapper
    return decorator
