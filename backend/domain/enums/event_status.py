from enum import Enum


class EventStatus(str, Enum):
    RECEIVED = 'received'
    VALIDATED = 'validated'
    QUEUED = 'queued'
    PROCESSING = 'processing'
    SUCCESS = 'success'
    FAILED = 'failed'
    RETRYING = 'retrying'
    PERMANENT_FAILURE = 'permanent_failure'
    REJECTED = 'rejected'
    TIMED_OUT = 'timed_out'


class FailureType(str, Enum):
    TIMEOUT = 'timeout'
    NETWORK_ERROR = 'network_error'
    VALIDATION_ERROR = 'validation_error'
    AUTH_ERROR = 'auth_error'
    RATE_LIMIT = 'rate_limit'
    SERVER_ERROR = 'server_error'
    UNKNOWN = 'unknown'


class LogLevel(str, Enum):
    DEBUG = 'debug'
    INFO = 'info'
    WARNING = 'warning'
    ERROR = 'error'
