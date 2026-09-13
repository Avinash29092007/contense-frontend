from datetime import date, timedelta


def calculate_streaks(completions):
    if not completions:
        return {
            "current": 0,
            "longest": 0
        }

    dates = sorted(
        {
            completion.date
            for completion in completions
        }
    )

    longest = 1
    current_run = 1

    for index in range(1, len(dates)):
        difference = dates[index] - dates[index - 1]

        if difference == timedelta(days=1):
            current_run += 1
        else:
            current_run = 1

        longest = max(longest, current_run)

    today = date.today()

    date_set = set(dates)

    if today in date_set:
        cursor = today
    elif today - timedelta(days=1) in date_set:
        cursor = today - timedelta(days=1)
    else:
        return {
            "current": 0,
            "longest": longest
        }

    current = 0

    while cursor in date_set:
        current += 1
        cursor -= timedelta(days=1)

    return {
        "current": current,
        "longest": max(longest, current)
    }
