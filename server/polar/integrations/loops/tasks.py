from typing import Unpack

import httpx
from arq import Retry

from polar.worker import JobContext, PolarWorkerContext, compute_backoff, task

from .client import Properties
from .client import client as loops_client

MAX_RETRIES = 10


@task("loops.update_contact", max_tries=MAX_RETRIES)
async def loops_update_contact(
    ctx: JobContext,
    email: str,
    id: str,
    polar_context: PolarWorkerContext,
    **properties: Unpack[Properties],
) -> None:
    try:
        await loops_client.update_contact(email, id, **properties)
    except httpx.HTTPError as e:
        raise Retry(compute_backoff(ctx["job_try"])) from e


@task("loops.send_event", max_tries=MAX_RETRIES)
async def loops_send_event(
    ctx: JobContext,
    email: str,
    event_name: str,
    polar_context: PolarWorkerContext,
    **properties: Unpack[Properties],
) -> None:
    try:
        await loops_client.send_event(email, event_name, **properties)
    except httpx.HTTPError as e:
        raise Retry(compute_backoff(ctx["job_try"])) from e
