{{? poll }}
<div class="composer-polls-summary alert alert-info mt-2">
    <strong>Poll attached:</strong> {{= poll.options.length }} option{{? poll.options.length > 1 }}s{{?}}
    <ul>
        {{~ poll.options :option:index }}
            <li>{{= option.text }}</li>
        {{~}}
    </ul>
</div>
{{?}}